// 'use client'

// import React from 'react'
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
//   } from "@/components/ui/dialog"
// import { Button } from '@/components/ui/button'
// import { Bot } from 'lucide-react'
// import { Textarea } from '@/components/ui/textarea'
// import { set } from 'date-fns'
// import { generateEmail } from './action'
// import { readStreamableValue, type StreamableValue } from 'ai/rsc'
// import useThreads from '@/hooks/use-threads'
// import { turndown } from '@/lib/turndown'
// import { boolean } from 'zod'
  

// type Props = {
//     isComposing : boolean,
//     onGenerate : (token:string) => void,
    
// }

// const AIComposeButton = (props: Props) => {
//     const [open, setOpen] = React.useState(false)
//     const [prompt, setPrompt] = React.useState('')
//     const {threads, threadId, account} = useThreads()
//     const thread = threads?.find((thread) => thread.id === threadId)
    
//     const aigenerate = async () => {
//         console.log("aigenerate called")
//         console.log("⚙️ [Client] Starting AI generation...", prompt);
//         if (!prompt) {
//             console.log("Empty prompt, aborting");
//             return;
//         }
        
//         try{
//             let context = 'testing context';
//             // props.isComposing =  true

//             // if(!props.isComposing){
//             //     for(const email of thread?.emails ?? []){
//             //         const content = `
//             //         Subject: ${email.subject}
//             //         From: ${email.from}
//             //         Sent: ${new Date(email.sentAt).toLocaleString()}
//             //         Body : ${turndown.turndown(email.body ?? email.bodySnippet ?? "")}
//             //         `
//             //         context += content
//             //     }
//             // }
//             // console.log("Context1: ", context)
//             // context += `
//             // My name is ${account?.name} and my email is ${account?.emailAddress}
//             // `
//             // console.log("Context: ", context)


//             const output = await generateEmail(context, prompt)
//             console.log("Prompt:", prompt)
  
//         console.log("📦 [Client] Received output stream:", output);
//         // console.log("Output: ", output)
//         const streamable = output as StreamableValue<string>;
//         console.log("Streamable: ", streamable)
//         let received_token : boolean = false

//         for await (const token of readStreamableValue(streamable)) {
//             console.log("📨 [Client] Token received:", token);

//             received_token = true

//             if(token){
//                 props.onGenerate(token)
//             } 
//             // else if(!token){
//             //    console.log("No token received")
//             // }
           
//         }
//         if(!received_token){
//             console.log("No Received token")
//         }
//         }catch(error){
//             console.log("Error generating email:", error);
//         }
        
        
        
//     }

//   return (
    
    
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger>
//                 <Button className='cursor-pointer' size='icon' variant={'outline'} onClick={() => setOpen(true)}>
//                     <Bot className='size-5'/>
//                 </Button>
//             </DialogTrigger>
//             <DialogContent>
//                 <DialogHeader>
//                 <DialogTitle>AI Smart Compose</DialogTitle>
//                 <DialogDescription>
//                     AI will help you compose an email
//                 </DialogDescription>

//                 <div className="h-2"></div>

//                 <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
//                     placeholder='Enter a prompt'/>

//                 <div className="h-2"></div>
//                 <Button onClick={async () => {
//                     try {
//                         // Only close after generation is complete
//                         setOpen(false);
//                         await aigenerate();
//                         setPrompt('');
                        
//                     } catch (error) {
//                         console.error("Error generating email:", error);
//                     }
//                 }} className='cursor-pointer'> 
//                     Generate
//                 </Button>
//                 </DialogHeader>
//             </DialogContent>
//         </Dialog>

//   )
// }

// export default AIComposeButton



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
import useThreads from '@/hooks/use-threads'
import { turndown } from '@/lib/turndown'
  

type Props = {
    isComposing : boolean,
    onGenerate : (token:string) => void,
}

const AIComposeButton = (props: Props) => {
    const [open, setOpen] = React.useState(false)
    const [prompt, setPrompt] = React.useState('')
    const {threads, threadId, account} = useThreads()
    const thread = threads?.find((thread) => thread.id === threadId)
    const [state, setState] = React.useState({
        isComposing: false,
      });
    
      const aigenerate = async () => {
        console.log("⚙️ [Client] Starting AI generation...", prompt);
        if (!prompt) {
          console.log("Empty prompt, aborting");
          return;
        }
      
        let fullContent = "";
        try {
          let context = "testing context";
          setState((prev) => ({ ...prev, isComposing: true }));
      
        //   if (props.isComposing) {
        //     for (const email of thread?.emails ?? []) {
        //       const content = `
        //         Subject: ${email.subject}
        //         From: ${email.from?.address || email.from?.name || email.from || "Unknown"}
        //         Sent: ${new Date(email.sentAt).toLocaleString()}
        //         Body: ${turndown.turndown(email.body ?? email.bodySnippet ?? "")}
        //       `;
        //       context += content;
        //       console.log(content);
        //       console.log("Email object:", email)
        //     }
        
        if (props.isComposing) {
            for (const email of thread?.emails ?? []) {
              const emailBody = email.body ?? email.bodySnippet ?? ""
              const markdownBody = turndown.turndown(emailBody)
              console.log("Email Body HTML:", emailBody) // Log original HTML
              console.log("Markdown Body (turndown):", JSON.stringify(markdownBody)) // Log markdown with visible newlines
              const content = `
                Subject: ${email.subject}
                From: ${email.from?.address || email.from?.name || email.from || "Unknown"}
                Sent: ${new Date(email.sentAt).toLocaleString()}
                Body: ${markdownBody}
              `
              context += content
              console.log(content)
              console.log("Email object:", email)
            }
            
          }
          context += `
            My name is ${account?.name} and my email is ${account?.emailAddress}
          `;
          console.log("Context: ", context);
      
          const output = await generateEmail(context, prompt);
          console.log("📦 [Client] Received output:", output);
      
          // Check if output is a StreamableValue
          for await (const token of readStreamableValue(output)) {
            console.log("📨 [Client] Token received:", token);
            if (token) {
              fullContent += token;
              console.log("Full Content: ", fullContent);
            } else {
              console.log("No token received");
            }
          }
      
          // Call onGenerate with the complete content
          props.onGenerate(fullContent);
          console.log("Generation complete, full content sent:", fullContent);
      
        } catch (error) {
          console.error("Error generating email:", error);
          // Optionally, show an error to the user (e.g., toast notification)
        } finally {
          setState((prev) => ({ ...prev, isComposing: false }));
        }
      };

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