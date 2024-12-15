import { GoogleGenerativeAI } from '@google/generative-ai';
import geocodeLocations from '../utilities/geocoding.js';
import { cleanGeminiResponse } from '../utilities/data.js';
import { convertToGeoJSON } from '../utilities/map.js';

/**
 * Koa route handler to make a POST request to the Google Generative Language API.
 * Requires the API key to be passed as an environment variable or directly configured.
 */
async function generateTourData(url) {

  const apiKey = process.env.GEMINI_API_KEY;  

  if (!apiKey) {
    ctx.status = 500;
    ctx.body = { error: 'Missing Gemini API key. Please set it in your environment variables.' };
    return;
}
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  let ctx = {};

  try {

    const prompt =  `
      At this site ${url}, please provide a list of tour dates within this site.
     Include the name of the venue, the date of the show, and the location of the venue.
    If possible, please provide the ticket price and a link to purchase tickets.
    The returned information should be serialized text as JSON, with an array of objects, each containing the following attributes:
    - name: The name of the venue
    - date: The date of the show
    - location: The location of the venue
    - price: The ticket price (optional)

    I should be able to parse the returned JSON and extract the information for each show.
    There should be no comments (including ticks in the returned text). The returned text must be able to pass 
    JSON.parse without error. 
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text()   ;

    // clear Gemini Response into DatesArray
    const candidateLocations = cleanGeminiResponse(text);
    // enrich with geocoding data 
    const locations = await geocodeLocations(candidateLocations)
    // convert to GeoJSON
    const geojson = convertToGeoJSON(locations)

    ctx.status = 200;
    ctx.body = geojson
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