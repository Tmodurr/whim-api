import Koa from 'koa';
import Router from 'koa-router';
import generateTourData from './routes/generateTourData.js';
import 'dotenv/config';

const app = new Koa();
const router = new Router();

/**
 * GET /tourdates
 * Query Parameter:
 * - url: The URL to fetch tour date data from
 * Response:
 * - GeoJSON containing the extracted tour dates
 */
router.get('/tourdates', async (ctx) => {
  const { url } = ctx.query;

  if (!url) {
    ctx.status = 400;
    ctx.body = { error: 'Missing required query parameter: url' };
    return;
  }

  try {
    
    // TODO Fetch the tour data from BARD; returns JSON with attributes (name, date, location, etc.)
    // Uses mapbox geocoding API to convert location to coordinates
    // creates a GeoJSON object with the data
    // uses geojson validator to validate the GeoJSON object
    // returns the GeoJSON object

    const response = await generateTourData()
    console.log(response)

    // Return the GeoJSON
    ctx.body = {
      type: 'FeatureCollection',
      features: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error fetching or processing tour data:', error);
    ctx.status = 500;
    ctx.body = { error: 'Failed to fetch or process tour data' };
  }
});



// Register the router
app.use(router.routes()).use(router.allowedMethods());

// Start the Koa server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
