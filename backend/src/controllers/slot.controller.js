// Import necessary modules
const session = require('express-session'); // For managing user sessions
const axios = require('axios'); // For making HTTP requests (used for currency conversion)
const fs = require('fs');  // File system module for file operations (logging)
require('dotenv').config(); // To load environment variables from .env file

// Slot machine reels with symbols for each reel
const reels = [
    ['cherry', 'lemon', 'apple', 'lemon', 'banana', 'banana', 'lemon', 'lemon'],
    ['lemon', 'apple', 'lemon', 'lemon', 'cherry', 'apple', 'banana', 'lemon'],
    ['lemon', 'apple', 'lemon', 'apple', 'cherry', 'lemon', 'banana', 'lemon']
];

// Reward table for matching symbols (2 or 3 matches of each symbol type)
const rewards = {
    "cherry": {2: 40, 3: 50},    // Cherry reward for 2 and 3 matches
    "apple": {2: 10, 3: 20},     // Apple reward for 2 and 3 matches
    "banana": {2: 5, 3: 15},     // Banana reward for 2 and 3 matches
    "lemon": {3: 3}              // Lemon reward only for 3 matches
};

// Function to simulate a slot machine spin
exports.spinSlotMachine = (req, res) => {
    // Initialize user balance if not set in session
    if (!req.session.balance) {
        req.session.balance = 20;  // Default starting balance
    }

    // Check if the user has enough balance to make a spin
    if (req.session.balance < 1) {
        return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct 1 coin for the spin
    req.session.balance -= 1;

    // Spin the reels: random selection of symbols from each reel
    const result = reels.map(reel => reel[Math.floor(Math.random() * reel.length)]);

    let reward = 0;

    // Calculate the reward based on the result of the spin
    if (result[0] === result[1] && result[1] === result[2]) {
        // All 3 symbols are the same, check for a 3 match reward
        reward = rewards[result[0]]?.[3] || 0;  // Fallback to 0 if no 3 match reward
    } else if (result[0] === result[1] || result[1] === result[2]) {
        // 2 symbols are the same, check for a 2 match reward
        const matchingSymbol = result[0] === result[1] ? result[0] : result[1];
        reward = rewards[matchingSymbol]?.[2] || 0;  // Fallback to 0 if no 2 match reward
    }

    // Add any winnings to the user balance
    req.session.balance += reward;

    // Log the session info, balance after spin, and spin result to a file
    const logMessage = `Session ID: ${req.sessionID}, Balance after spin: ${req.session.balance}, Spin Result: ${result.join(', ')}\n`;
    fs.appendFileSync('balance_log.txt', logMessage); // Append log to balance_log.txt file

    console.log(`Session ID: ${req.sessionID}, User balance after spin: ${req.session.balance}`);

    // Send back the spin results, coins won, and updated balance as JSON response
    res.json({
        spinResult: result,
        coinsWon: reward,
        balance: req.session.balance
    });
};

// Function to convert the user's balance to a different currency
exports.convertCurrency = async (req, res) => {
    console.log('User balance before conversion:', req.session.balance);

    // Get target currency from the query, default to 'USD'
    const targetCurrency = req.query.currency || 'USD';

    // If no target currency is provided, return an error
    if (!targetCurrency) {
        return res.status(400).json({ error: 'Currency parameter required' });
    }

    try {
        // Get the API key for currency conversion from environment variables
        const apiKey = process.env.CURRENCY_API_KEY;
        
        // Make a request to the exchange rate API to get conversion rates
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);

        // Check if the response contains valid data
        if (!response.data || !response.data.conversion_rates) {
            throw new Error("Invalid exchange rate API response");
        }

        // Get the conversion rate for the target currency
        const rate = response.data.conversion_rates[targetCurrency.toUpperCase()];

        // If the rate is not found, return an error
        if (!rate) {
            return res.status(400).json({ error: 'Invalid currency code' });
        }

        // Get the user's current balance (defaults to 20 if not set)
        const userBalance = req.session.balance || 20;

        // Convert the user's balance to the target currency
        const convertedAmount = userBalance * rate;

        // Log the conversion details to a file
        const logMessage = `Session ID: ${req.sessionID}, Balance before conversion: ${req.session.balance}, Converted to: ${targetCurrency}, Converted Balance: ${convertedAmount.toFixed(2)}\n`;
        fs.appendFileSync('balance_log.txt', logMessage); // Append log to balance_log.txt file

        // Return the converted balance, currency code, and exchange rate in the response
        res.json({
            convertedBalance: convertedAmount.toFixed(2),
            currency: targetCurrency.toUpperCase(),
            currencyRate: rate
        });
    } catch (error) {
        // If an error occurs during conversion, log it and return an error response
        console.error(error.message);
        res.status(500).json({ error: 'Failed to convert currency' });
    }
};

// Function to get the current user balance
exports.getBalance = (req, res) => {
    // Initialize user balance if not set in session
    if (!req.session.balance) {
        req.session.balance = 20;  // Default starting balance
    }

    // Return the user's balance as JSON response
    const balance = req.session.balance;
    res.json({ balance });
};
