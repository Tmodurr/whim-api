import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

function removeJSONComment(text) {
  if (typeof text !== 'string') {
      throw new Error('Input must be a string.');
  }

  // Regular expression to match the ```json and ``` markers
  const markersRegex = /```json|```/g;

  // Remove the markers while keeping the content between them
  const cleanedText = text.replace(markersRegex, '').trim();

  try {
      // Validate if the result is parsable JSON
      JSON.parse(cleanedText);
  } catch (error) {
      throw new Error('The resulting string is not valid JSON.');
  }

  return cleanedText;
}


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

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  let ctx = {};
  // Check if the API key is provided

  try {


    const bandUrl = 'http://thebarrbrothers.com/'

    const prompt =  `
      At this site ${bandUrl}, please provide a list of tour dates for the band.
     Include the name of the venue, the date of the show, and the location of the venue.
    If possible, please provide the ticket price and a link to purchase tickets.
    The returned information should be serialized text as JSON, with an array of objects, each containing the following attributes:
    - name: The name of the venue
    - date: The date of the show
    - location: The location of the venue
    - price: The ticket price (optional)

    I should be able to parse the returned JSON and extract the information for each show.
    There should be no comments (including ticks in the returned text). The returned text must be able to pass 
    JSON.parse without error. T
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text()   ;
    const cleanedString = removeJSONComment(text);
    let parsedJson = JSON.parse(cleanedString);
    console.log("Valid JSON:", parsedJson);
    console.log(cleanedString)
    // Respond to the client with the API response
    ctx.status = 200;
    ctx.body = json
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