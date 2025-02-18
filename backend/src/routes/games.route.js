// Import the express module to create the router and handle routing
const express = require('express');

// Import the controller function to handle the request logic for getting all games
const { getAllGames } = require('../controllers/games.controller');

// Import the cache middleware to cache the responses
const cacheMiddleware = require("../middleware/cache.middleware");

// Create a new router instance using express.Router()
const router = express.Router();

// Define the route for GET requests to the root of this router ('/')
// The cacheMiddleware is applied to this route first, followed by the getAllGames controller
// This means the cacheMiddleware will handle caching, and if no cache exists, the getAllGames function will be called
router.get('/', cacheMiddleware, getAllGames);

// Export the router so it can be used in other parts of the application
module.exports = router;
