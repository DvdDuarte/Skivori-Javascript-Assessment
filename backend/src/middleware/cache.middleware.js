// Load environment variables from a .env file into process.env
require('dotenv').config();

// Create an in-memory cache using JavaScript's Map object
const cache = new Map();

// Set the cache time-to-live (TTL) from the environment variable, default is 2 minutes (in milliseconds)
const CACHE_TTL = process.env.CACHE_TTL || 2 * 60 * 10000; // Default TTL is 2 minutes

// Middleware to handle caching of responses
const cacheMiddleware = (req, res, next) => {
    // Extract the 'search' query parameter and convert it to lowercase, default to "all" if not provided
    const searchKey = req.query.search?.toLowerCase() || "all";

    // Check if the cache has data for the current searchKey
    if (cache.has(searchKey)) {
        // If data is found, get the cached data and timestamp
        const { data, timestamp } = cache.get(searchKey);

        // If the cache is still valid (not expired based on TTL), serve the data from the cache
        if (Date.now() - timestamp < CACHE_TTL) {
            console.log("Serving from cache:", searchKey);  // Log that data is being served from cache
            return res.json(data); // Send the cached data as the response
        }

        // If the cache has expired, delete it
        cache.delete(searchKey);
    }

    // Capture the original res.json method to override it and cache the response
    const originalJson = res.json;

    // Override the res.json method to intercept and cache the response
    res.json = (body) => {
        // If the data already exists in the cache, delete it to reinsert as the most recent (LRU - Least Recently Used)
        if (cache.has(searchKey)) {
            cache.delete(searchKey); // Remove existing cache entry
        }

        // Store the new data and timestamp in the cache
        cache.set(searchKey, { data: body, timestamp: Date.now() });

        // If the cache size exceeds 50 entries, remove the least recently used cache entry
        if (cache.size > 50) {
            // Get the first key in the Map (LRU item) and delete it
            const oldestKey = cache.keys().next().value;
            cache.delete(oldestKey);
        }

        // Ensure that the original res.json method is called to send the response
        return originalJson.call(res, body);
    };

    // Proceed to the next middleware or route handler
    next();
};

// Export the cache middleware to be used in other parts of the application
module.exports = cacheMiddleware;
