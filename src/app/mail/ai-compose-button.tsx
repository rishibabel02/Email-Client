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
import { readStreamableValue } from 'ai/rsc'
  

type Props = {
    isComposing : boolean,
    onGenerate : (token:string) => void,
}

const AIComposeButton = (props: Props) => {
    const [open, setOpen] = React.useState(false)
    const [prompt, setPrompt] = React.useState('')

    const aigenerate = async () => {
      const {output}= await generateEmail('', prompt)
      for await (const token of readStreamableValue(output)) {
        if(token){
            console.log(token)
            props.onGenerate(token)
        } 
      }
    }

  return (
        <Dialog >
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
                <Button onClick={() => {
                    aigenerate()
                    setOpen(false)
                    setPrompt('')
                }}> 
                    Generate
                </Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>

  )
}

export default AIComposeButton