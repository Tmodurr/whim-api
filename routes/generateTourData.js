import axios from 'axios';

/**
 * Koa route handler to make a POST request to the Google Generative Language API.
 * Requires the API key to be passed as an environment variable or directly configured.
 */
async function generateTourData(url='') {
  



    const apiKey = process.env.GEMINI_API_KEY; // Replace with your actual API key or load from .env
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    let ctx = {};
    // Check if the API key is provided
    if (!apiKey) {
      ctx.status = 500;
      ctx.body = { error: 'Missing Gemini API key. Please set it in your environment variables.' };
      return;
    }
  
    try {
     
  
      const prompt = "";
      const result = await model.generateContent([prompt, image]);
      console.log(result.response.text());

      // Respond to the client with the API response
      ctx.status = 200;
      ctx.body = response.data;
      console.log(response.data)
    } catch (error) {
      console.error('Error making request to Google Generative Language API:', error);
  
      // Handle errors from the request
      ctx.status = error.response?.status || 500;
      ctx.body = {
        error: 'Failed to generate content',
        details: error.response?.data || error.message,
      };
    }
  }

  export default generateTourData;