import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Koa route handler to make a POST request to the Google Generative Language API.
 * Requires the API key to be passed as an environment variable or directly configured.
 */
async function generateTourData(url = '') {

  const apiKey = process.env.GEMINI_API_KEY;  
  
  if (!apiKey) {
    ctx.status = 500;
    ctx.body = { error: 'Missing Gemini API key. Please set it in your environment variables.' };
    return;
}
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let ctx = {};
  // Check if the API key is provided

  try {


    const prompt = "Write a story about a magic backpack.";

    const result = await model.generateContent(prompt);
    const text = result.response.text()   ;
  
    // Respond to the client with the API response
    ctx.status = 200;
    ctx.body = text
    return ctx
  } catch (error) {
    console.error('Error making request to Google Generative Language API:', error);

    // Handle errors from the request
    ctx.status = error.response?.status || 500;
    ctx.body = {
      error: 'Failed to generate content',
      details: error.response?.data || error.message,
    };
    return ctx
  }
}

export default generateTourData;