// 'use client'

// import React, { useState } from 'react';
// import { openai } from '@ai-sdk/openai';
// import { generateText } from 'ai';
// import { Button } from '@/components/ui/button';

// const TestOpenAIButton = () => {
//   const [reply, setReply] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const { text } = await generateText({
//         model: openai('gpt-4-turbo'),
//         prompt: 'Write a vegetarian lasagna recipe for 4 people.',
//       });
//       setReply(text);
//       console.log(text);
//     } catch (error) {
//       setReply('Error generating reply');
//     }
//     setLoading(false);
//   };

//   return (
//     <div>
//       <Button onClick={handleGenerate} disabled={loading}>
//         {loading ? 'Generating...' : 'Generate Reply'}
//       </Button>
//       <div style={{ marginTop: '1rem' }}>
//         <textarea
//           value={reply}
//           onChange={e => setReply(e.target.value)}
//           rows={10}
//           cols={60}
//           placeholder="Reply will appear here"
//         />
//       </div>
//     </div>
//   );
// };

// export default TestOpenAIButton;

