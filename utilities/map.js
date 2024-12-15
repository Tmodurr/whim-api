/**
 * Converts an array of location objects into a GeoJSON Point Feature Collection
 * @param {Array} locations - Array of location objects with id, name, location, placename, lat, and lng properties
 * @returns {Object} - A GeoJSON FeatureCollection of Point features
 */
export const convertToGeoJSON = (locations) => {
    if (!Array.isArray(locations)) {
        throw new Error("Input must be an array of locations.");
    }

    // Map locations to GeoJSON Point features
    const features = locations.map(({ id, name, location, date, placename, lat, lng }) => {
        if (lat == null || lng == null) {
            throw new Error(`Missing coordinates for location with id: ${id}`);
        }

        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [lng, lat], // GeoJSON uses [longitude, latitude]
            },
            properties: {
                id,
                name,
                date,
                location,
                placename,
            },
        };
    });

    // Return a valid GeoJSON FeatureCollection
    return {
        type: "FeatureCollection",
        features,
    };
}