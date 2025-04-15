"use server"

import { auth } from "@clerk/nextjs/server"
import axios from "axios"

export const getAurinkoAuthUrl = async (serviceType : 'Google' | 'Office365') => {
    const {userId} = await auth()
    if(!userId) throw new Error("Unauthorized")

        const params = new URLSearchParams({
            clientId: process.env.AURINKO_CLIENT_ID as string,
            serviceType: serviceType,
            scopes: 'Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All ' ,
            responseType : 'code',
            returnUrl : `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`
        })

        return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`
} 

export const exchangeCodeForAccessToken = async (code : string) => {

//  here below the 2nd object is {} i.e. empty because that's for the body of the request and we don't need any body for this request so we pass empty object

    try{
        const response = await axios.post(`https://api.aurinko.io/v1/auth/token/${code}`,{}, {
            auth:{
                username : process.env.AURINKO_CLIENT_ID as string,
                password : process.env.AURINKO_CLIENT_SECRET as string
            }
        })
        return response.data as {
            accountId : number,
            accessToken : string,
            userId : string,
            userSession : string
        }
    }catch(e){
        if(axios.isAxiosError(e)){
            console.error('Token exchange error:', e.response?.data)
            throw new Error(`Failed to exchange code for token: ${e.response?.data?.message || e.message}`)
        }
        throw new Error('Failed to exchange code for token')
    }
}

export const getAccountDetails = async (accessToken: string) => {
    try {
        const response = await axios.get('https://api.aurinko.io/v1/account', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data as {
            email: string,
            name: string
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching account details:', error.response?.data);
        } else {
            console.error('Unexpected error fetching account details:', error);
        }
        throw error;
    }
}

// export const getAccountDetails = async (accessToken : string) => {
//     try{
//         const response = await axios.get('https://api.aurinko.io/v1/account', {
//             headers : {
//                 Authorization : `Bearer ${accessToken}`
//             } 
//         })
//         const data = response.data as {
//             email : string,
//             name : string
//         }
//         if (!data.email || !data.name) {
//             throw new Error('Invalid account details received')
//         }
//         return data
//     }catch(e){
//         if(axios.isAxiosError(e)){
//             console.error('Account details error:', e.response?.data)
//             throw new Error(`Failed to fetch account details: ${e.response?.data?.message || e.message}`)
//         }
//         throw new Error('Failed to fetch account details')
//     }
// }