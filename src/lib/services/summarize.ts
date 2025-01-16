import { Env } from '@env';
import axios from 'axios';

const openAI = axios.create({
  baseURL: Env.OPENAI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Env.OPENAI_API_KEY}`,
  },
});

export const summarizeText = async (prompt: any) => {
  const promptText = `The following text has been extracted from an image using OCR. Your task is to generate a concise and meaningful summary by identifying the main ideas, key points, and essential information. 

    Please focus on summarizing the text clearly and accurately while ignoring irrelevant details or minor points. 
    
    Keep the summary:
    - Brief and under 100 words.
    - Written in clear and simple language.
    - Focused solely on the primary content and context.
    
    Here is the text to summarize:
    
    ${prompt}`;
  try {
    const response = await openAI.post('/chat/completions', {
      model: Env.OPENAI_MODEL,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: promptText,
        },
      ],
      max_tokens: Env.OPENAI_MAX_TOKENS,
    });
    console.log('OpenAI Response:', response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      'Error generating text:',
      (error as any).response?.data || (error as any).message
    );
    throw error;
  }
};
