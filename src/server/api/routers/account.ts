import { createTRPCRouter, privateprocedure } from "../trpc";

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
    })

})