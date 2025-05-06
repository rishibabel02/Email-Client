'use client'

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Bot } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { set } from 'date-fns'
import { generateEmail } from './action'
import { readStreamableValue, type StreamableValue } from 'ai/rsc'
  

type Props = {
    isComposing : boolean,
    onGenerate : (token:string) => void,
}

const AIComposeButton = (props: Props) => {
    const [open, setOpen] = React.useState(false)
    const [prompt, setPrompt] = React.useState('')

    
    const aigenerate = async () => {
        console.log("⚙️ [Client] Starting AI generation...", prompt);
        if (!prompt) {
            console.log("Empty prompt, aborting");
            return;
        }

        // let fullContent = "";
        try{
            const {output} = await generateEmail('', prompt)
        console.log("Prompt:", prompt)
  
        console.log("📦 [Client] Received output stream:", output);
        // console.log("Output: ", output)
        const streamable = output as StreamableValue<string>;
        for await (const token of readStreamableValue(streamable)) {
            console.log("📨 [Client] Token received:", token);
            if(token){
                props.onGenerate(token)
            } 
            else if(!token){
               console.log("No token received")
            }
           
        }
        }catch(error){
            console.log("Error generating email:", error);
        }
        
        
        
    }

  return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button className='cursor-pointer' size='icon' variant={'outline'} onClick={() => setOpen(true)}>
                    <Bot className='size-5'/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>AI Smart Compose</DialogTitle>
                <DialogDescription>
                    AI will help you compose an email
                </DialogDescription>

                <div className="h-2"></div>

                <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                    placeholder='Enter a prompt'/>

                <div className="h-2"></div>
                <Button onClick={async () => {
                    try {
                        
                        // Only close after generation is complete
                        setOpen(false);
                        setPrompt('');
                        await aigenerate();
                    } catch (error) {
                        console.error("Error generating email:", error);
                    }
                }} className='cursor-pointer'> 
                    Generate
                </Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>

  )
}

export default AIComposeButton


