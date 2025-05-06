'use server'

import {streamText} from 'ai'
import {openai} from '@ai-sdk/openai'
import {createStreamableValue} from 'ai/rsc'

export async function generateEmail(context : string , prompt : string) {

    const stream = createStreamableValue('');
    (
        async () => {
            const {textStream} = await streamText({
                model: openai('gpt-4-turbo'),
                prompt : `
                You are an AI email assistant embedded in an email client application.
                You are given a context of the email client and the user's prompt.
                You are to generate an email based on the user's prompt.
                You are to generate the email in markdown format.
                You are to generate the email in a way that is easy to read and understand.

                The time now is ${new Date().toLocaleString()}.
                start context block
                ${context}
                end context block
                
                user prompt
                ${prompt}

                when responding : 
                - Be helpful, clever and polite.
                - Always use the context provided to you.
                - Always use the user's prompt to generate the email.
                - Always generate the email in markdown format.
                - Avoid apologizing for previous responses.Instead indicate that you have updated your knowledge and provide new information.
                - Keep your response focused on the user's prompt.
                - Don't add fluff like " Here's your email" or so.
                - Directly output the email.
                - Don't include any explanations.
                - Don't include any acknowledgments.
                
                `,
                
            })

            for await (const token of textStream) {
                stream.update(token)
            }
            stream.done()
        }
    ) ()
    return {output : stream.value}
}