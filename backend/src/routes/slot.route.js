// Import the express module to create a router for handling routes
const express = require('express');

// Create a new router instance using express.Router()
const router = express.Router();

// Import the slotController which contains the business logic for slot machine actions
const slotController = require('../controllers/slot.controller');

// Define routes for slot machine functionality

// Route for spinning the slot machine, triggers the spinSlotMachine function in the slotController
router.get('/spin', slotController.spinSlotMachine);

// Route for converting user balance to another currency, triggers the convertCurrency function in the slotController
router.get('/convert', slotController.convertCurrency);

// Route for retrieving the user's balance, triggers the getBalance function in the slotController
router.get('/balance', slotController.getBalance);  // Ensure this matches the new function

// Export the router so it can be used and mounted in the main application file
module.exports = router;
