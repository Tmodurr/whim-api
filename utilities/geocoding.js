import axios from "axios";

/**
 * Query the Mapbox Geocoder API
 * @param {string} location - The location to geocode (e.g., an address or place name).
 * @returns {Promise<object>} - A promise that resolves to the geocoding results.
 */
async function queryMapboxGeocoder(location) {
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN;

  if (!location || !accessToken) {
    throw new Error("Location and access token are required.");
  }

  const geocoderURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json`;

  try {
    const response = await axios.get(geocoderURL, {
      params: {
        access_token: accessToken,
        limit: 1, // Only fetch the top result
      },
    });
    return response.data; // Return the geocoding results
  } catch (error) {
    console.error("Error querying Mapbox Geocoder:", error.response?.data || error.message);
    throw error; // Re-throw the error for handling by the caller
  }
}

/**
 * Geocode an array of locations using Mapbox Geocoder API
 * @param {Array} locations - Array of location objects, each with `id`, `name`, and `location`.
 * @returns {Promise<Array>} - A promise that resolves to an array of enriched location objects.
 */
const geocodeLocations = async (locations) => {
  if (!Array.isArray(locations)) {
    throw new Error("Input must be an array of objects.");
  }

  // Use Promise.all to handle multiple geocoding requests in parallel
  const results = await Promise.all(
    locations.map(async ({ name, location, date}, idx) => {
      const fullQuery = `${name}, ${location}`; // Combine name and location for geocoding
      try {
        const data = await queryMapboxGeocoder(fullQuery);
        const firstResult = data.features[0]; // Take the first result

        if (firstResult) {
          const { place_name, center } = firstResult; // Extract placename and coordinates
          return {
            id: idx + 1, // Use the index as the ID
            name,
            date, 
            location,
            placename: place_name,
            lat: center[1],
            lng: center[0],
          };
        }

        // Return null values if no results are found
        return {
          id,
          name,
          location,
          placename: null,
          lat: null,
          lng: null,
        };
      } catch (error) {
        console.error(`Failed to geocode location (ID: ${id}):`, error.message);
        return {
          id : idx + 1,
          name,
          location,
          placename: null,
          lat: null,
          lng: null,
        };
      }
    })
  );

  return results;
};

export default geocodeLocations;