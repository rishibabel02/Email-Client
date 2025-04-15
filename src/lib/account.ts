import type { EmailMessage, SyncResponse, SyncUpdatedResponse } from "@/types";
import axios from "axios";

export class Account {
    private token : String;

    constructor(token : String) {
        this.token = token;
    }

    private async startSync() {
        const res = await axios.post<SyncResponse>('https://api.aurinko.io/v1/email/sync',{},{
            headers : {
                Authorization : `Bearer ${this.token}`
            },params : { 
                daysWithin : 2,
                bodytypo : "html"
            }
        })

        return res.data

    }

    async getUpdatedEmails({deltaToken, pageToken} : {deltaToken ?: string, pageToken ?: string}) {
        let params: Record<string, string> = {}
        if(deltaToken){
            params.deltaToken = deltaToken;
        }
        if(pageToken){
            params.pageToken = pageToken;
        }

        const res = await axios.get<SyncUpdatedResponse>('https://api.aurinko.io/v1/email/sync/updated',{
            headers : {
                Authorization : `Bearer ${this.token}`
            }, params
        })
        return res.data;
    }


    async performIntialSync() {
        try{
            // start the sync process
            let syncResponse = await this.startSync();
            while(!syncResponse.ready){
                await new Promise(resolve => setTimeout(resolve, 1000));
                syncResponse = await this.startSync();
            }

            // we can now ensure that the sync response is ready and we can bookmark the required delta token

            let storedDeltaToken = syncResponse.syncUpdatedToken;

            // Now when we have this we can hit the 2nd endpoint which is "/email/sync/updated " to actually get back the records as well as the next page token 

            let updatedResponse = await this.getUpdatedEmails ({deltaToken : storedDeltaToken});
            if(updatedResponse.nextDeltaToken){
                // sync has completed and we have to take note of the latestDetlaToken

                storedDeltaToken = updatedResponse.nextDeltaToken;
            }

            let allEmails : EmailMessage[] = updatedResponse.records
            // fetch more pages if there are any
            while(updatedResponse.nextPageToken){
                updatedResponse = await this.getUpdatedEmails({pageToken : updatedResponse.nextPageToken})
                allEmails = allEmails.concat(updatedResponse.records)

                if(updatedResponse.nextDeltaToken){
                    // sync has ended 
                    storedDeltaToken = updatedResponse.nextDeltaToken;
                }
            }
            console.log("Initial Sync Completed, We've synced ",allEmails.length, "emails")

            // and now we need to store the latestDeltaToken in our database so that we can use it in the future to get the latest emails

            await this.getUpdatedEmails( {deltaToken : storedDeltaToken} )
            return {
                emails : allEmails,
                deltaToken : storedDeltaToken
            }
        }catch(e){
            if(axios.isAxiosError(e)){
                console.log(e.response?.data)
            }else{
                console.log(e)
            }
        }
    }

}