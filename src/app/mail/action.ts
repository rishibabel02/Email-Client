'use server'

import {streamText} from 'ai'
import {openai} from '@ai-sdk/openai'
import {createStreamableValue} from 'ai/rsc'

export async function generateEmail(context: string, prompt: string) {
    console.log("[Server] Prompt received:", prompt);
    console.log("[Server] Context received:", context);
    
    if (!prompt) {
        console.log("No prompt provided");
        return { output: createStreamableValue('') };
    }

    const stream = createStreamableValue('');
    
    try {
        const {textStream} = await streamText({
            model: openai('gpt-3.5-turbo'),
            messages: [
                {
                    role: "system",
                    content: `You are an AI email assistant embedded in an email client application.
You are given a context of the email client and the user's prompt.
You are to generate an email based on the user's prompt.
You are to generate the email in markdown format.
You are to generate the email in a way that is easy to read and understand.

The time now is ${new Date().toLocaleString()}.

start context block
${context}
end context block

when responding : 
- Be helpful, clever and polite.
- Always use the context provided to you.
- Always use the user's prompt to generate the email.
- Always generate the email in markdown format.
- Avoid apologizing for previous responses.Instead indicate that you have updated your knowledge and provide new information.
- Keep your response focused on the user's prompt.
- Don't add any fluff like " Here's your email" or so.
- Directly output the email.
- Don't include any explanations.
- Don't include any acknowledgments.
`
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });
        console.log("🚰 [Server] Streaming response started");
        for await (const token of textStream) {
            console.log("🔁 [Server] Token:", token);
            stream.update(token);
        }
        stream.done();
    } catch (error) {
        console.error("[Server] Error generating email:", error);
        stream.update("Error generating email");
        stream.done();
    }
    
   
    return { output: stream.value };
}

