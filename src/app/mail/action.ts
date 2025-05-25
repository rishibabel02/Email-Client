// // 'use server'

// // import {streamText} from 'ai'
// // import {openai} from '@ai-sdk/openai'
// // import {createStreamableValue} from 'ai/rsc'

// // export async function generateEmail(context: string, prompt: string) {
// //     console.log("[Server] Prompt received:", prompt);
// //     console.log("[Server] Context received:", context);
    
// //     if (!prompt) {
// //         console.log("No prompt provided");
// //         return { output: createStreamableValue<string>() };
// //     }

// //     const stream = createStreamableValue<string>();
    
// //     try {
// //         const model = openai('gpt-3.5-turbo');
         
// //         const {textStream} = await streamText({
// //             model: model,
// //             // prompt : 'Hello , How are you?',
// //             messages: [
// //                 { 
// //                     role: "system",
// //                     content: `You are an AI email assistant embedded in an email client application.
// // You are given a context of the email client and the user's prompt.
// // You are to generate an email based on the user's prompt.
// // You are to generate the email in markdown format.
// // You are to generate the email in a way that is easy to read and understand.

// // The time now is ${new Date().toLocaleString()}.

// // start context block
// // ${context}
// // end context block

// // when responding : 
// // - Be helpful, clever and polite.
// // - Always use the context provided to you.
// // - Always use the user's prompt to generate the email.
// // - Always generate the email in markdown format.
// // - Avoid apologizing for previous responses.Instead indicate that you have updated your knowledge and provide new information.
// // - Keep your response focused on the user's prompt.
// // - Don't add any fluff like " Here's your email" or so.
// // - Directly output the email.
// // - Don't include any explanations.
// // - Don't include any acknowledgments.
// // `
// //                 },
// //                 {
// //                     role: "user",
// //                     content: prompt
// //                 }
// //             ]


// //         });
// //         console.log("Ts", textStream)
// //         console.log("🚰 [Server] Streaming response started");
// //         // for await (const token of textStream) {
// //         //     console.log("🔁 [Server] Token:", token);
// //         //     stream.update(token);
// //         // }
// //         let fullText = 'hi: ';
// //         for await (const chunk of textStream) {
// //             fullText += chunk;
// //             stream.append(chunk); // Send the accumulated text
// //             console.log(chunk)
// //             console.log(fullText)
// //         }

// //         stream.done();
// //         return { output: fullText };
// //     } catch (error) {
// //         console.error("[Server] Error generating email:", error);
// //         stream.update("Error generating email");
// //         stream.done();
// //         // throw new error('Error generating email')
// //     }
    
   
    
// // }





'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createStreamableValue } from 'ai/rsc'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateEmail(context: string, prompt: string) {
    console.log("[Server] Prompt received:", prompt);
    console.log("[Server] Context received:", context);
    
    const stream = createStreamableValue('');

  try {
    if (!prompt) {
      console.log("No prompt provided");
      stream.done();
      return stream.value;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const fullPrompt = `
You are an AI email assistant embedded in an email client application.
You are given a context of the email client and the user's prompt.
You are to generate an email based on the user's prompt.
You are to generate the email in markdown format.
You are to generate the email in a way that is easy to read and understand.

The time now is ${new Date().toLocaleString()}.

start context block
${context}
end context block

when responding: 
- Be helpful, clever and polite.
- Always use the context provided to you.
- Always use the user's prompt to generate the email.
- Always generate the email in markdown format.
- Avoid apologizing for previous responses. Instead, indicate that you have updated your knowledge and provide new information.
- Keep your response focused on the user's prompt.
- Don't add any fluff like "Here's your email" or so.
- Directly output the email.
- Don't include any explanations.
- Don't include any acknowledgments.

User prompt:
${prompt}
        `;

        const result = await model.generateContent(fullPrompt);
        const response = result.response.text();
        console.log("Gemini response (raw):", JSON.stringify(response)) // Log to inspect newlines
        console.log("Gemini response:", response)
    
        // Stream the response
        stream.update(response);
        stream.done();
        return stream.value;
    
      } catch (error) {
        console.error("[Server] Error generating email:", error);
        stream.update("Error generating email");
        stream.done();
        return stream.value;
    }

    // return  stream.value ;
}