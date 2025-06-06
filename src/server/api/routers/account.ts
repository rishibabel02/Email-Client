import { z } from "zod";
import { createTRPCRouter, privateprocedure } from "../trpc";
import { db } from "@/server/db";
import type { Prisma } from "@prisma/client";
import { Inclusive_Sans } from "next/font/google";

export const authoriseAccountAccess = async (accountId: string, userId: string) => {
    
    const account = await db.account.findUnique({
        where: {
            id: accountId,
            userId
        },
        select: {
            id: true,  
            emailAddress: true,
            name: true,
            accessToken : true
        }
    })
    if (!account)  throw new Error("Account not found") 
    return account
}


export const accountRouter = createTRPCRouter({
    getAccounts : privateprocedure.query(async ({ ctx }) => {
        return await ctx.db.account.findMany({
            where:{
                userId:ctx.auth.userId
            },select:{
                id:true,
                emailAddress : true,
                name :true
            }
        })
    }),

    getNumThreads : privateprocedure.input(z.object({
        accountId : z.string(),
        tab : z.string()
    })).query(async ({ ctx , input }) => {
        const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId)

        let filter : Prisma.ThreadWhereInput = {}
        if(input.tab === "inbox") filter.inboxStatus = true
        else if(input.tab === "draft") filter.draftStatus = true
        else if(input.tab === "sent") filter.sentStatus = true
    
        return await ctx.db.thread.count({
            where : {
                accountId : account.id,
                ...filter
            }
        })
    }),

    getThreads : privateprocedure.input(z.object({
        accountId : z.string(),
        tab : z.string(),
        done : z.boolean()
    })).query(async ({ ctx, input }) => {
        const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId)

        let filter : Prisma.ThreadWhereInput = {}
        if(input.tab === "inbox") filter.inboxStatus = true
        else if(input.tab === "draft") filter.draftStatus = true
        else if(input.tab === "sent") filter.sentStatus = true

        filter.done = {
            equals : input.done
        }
        return await ctx.db.thread.findMany({
            where : filter,
            include : {
                emails : {
                    orderBy : {
                        sentAt : 'asc'
                    },select:{
                       from : true,
                       body : true,
                       bodySnippet : true,
                       emailLabel : true,
                       subject : true,
                       sysLabels : true,
                       sentAt : true,
                       id : true
                    }
                }
            },
            take : 15,
            orderBy : {
                lastMessageDate : 'desc'
            }
        })
       
    }),


    getSuggestions: privateprocedure.input(z.object({
        accountId : z.string(),
    })).query(async ({ctx,input}) =>{
        const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId)
        return await ctx.db.emailAddress.findMany({
            where:{
                accountId : account.id
            },
            select:{
                address : true,
                name : true
            }
        })
    }),

    getReplyDetails : privateprocedure.input(z.object({
        accountId : z.string(),
        threadId : z.string()
    })).query(async ({ctx,input}) => {
        const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId)
        const thread = await ctx.db.thread.findFirst({
            where:{
                id : input.threadId
            },
            include:{
                emails:{
                    orderBy:{
                        sentAt : 'asc'
                    },
                    select:{
                        from : true,
                        to : true,
                        cc : true,
                        bcc : true,
                        subject : true,
                        sentAt : true,
                        internetMessageId : true,
                    }
                }
            }
        })
        if(!thread || thread.emails.length === 0) throw new Error("Thread not found")

            const lastExternalEmail = thread.emails.reverse().find((email) => email.from.address !== account.emailAddress)
            if(!lastExternalEmail) throw new Error("No external email found")

            return{
                subject: lastExternalEmail.subject,
                to: [lastExternalEmail.from , ...lastExternalEmail.to.filter((email) => email.address !== account.emailAddress)],
                cc : lastExternalEmail.cc.filter((cc) => cc.address!== account.emailAddress),
                from : {name : account.name, address : account.emailAddress},
                id: lastExternalEmail.internetMessageId
            }
    })

})