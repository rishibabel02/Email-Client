'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GoogleGenerativeAI } from '@google/generative-ai';

const TestGeminiButton = () => {
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI('');

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const result = await model.generateContent('Write a vegetarian lasagna recipe for 4 people.');
      const response = await result.response;
      const text = response.text();

      setReply(text);
      console.log(text);
    } catch (error) {
      console.error('Error generating content:', error);
      setReply('Error generating reply');
    }
    setLoading(false);
  };

  return (
    <div>
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Reply'}
      </Button>
      <div style={{ marginTop: '1rem' }}>
        <textarea
          value={reply}
          onChange={e => setReply(e.target.value)}
          rows={10}
          cols={60}
          placeholder="Reply will appear here"
        />
      </div>
    </div>
  );
};

export default TestGeminiButton;