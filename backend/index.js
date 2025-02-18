// Load environment variables from .env file into process.env
require('dotenv').config();

// Importing necessary modules
const express = require('express'); // Express framework for building the server
const cors = require('cors'); // Middleware to handle Cross-Origin Resource Sharing
const helmet = require('helmet'); // Security middleware to protect against web vulnerabilities
const morgan = require('morgan'); // HTTP request logger middleware
const rateLimit = require("express-rate-limit"); // Rate limiting to prevent abuse
const session = require('express-session'); // Middleware to handle sessions (stores data like user balance)

const errorHandler = require('./src/middleware/errorHandler.middeware'); // Custom error handling middleware
const gamesRoute = require('./src/routes/games.route'); // Route for game-related requests
const slotRoute = require('./src/routes/slot.route'); // Route for slot machine-related requests

// Initialize the Express app
const app = express();

// Security Middleware: Helmet adds security headers to responses
app.use(helmet()); // Protects against common web vulnerabilities (e.g., cross-site scripting)

// Logging Middleware: Morgan logs HTTP requests for debugging and tracking
app.use(morgan('combined')); // Logs request method, URL, status, and other details in a standard combined format

// Rate Limiting Middleware: Limits the number of requests to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Set time window for rate limiting (15 minutes)
  max: 100, // Max 100 requests allowed from a single IP within that time window
  message: "Too many requests from this IP, please try again after 15 minutes" // Error message when the limit is exceeded
});
app.use(limiter); // Apply the rate limiter globally to all routes

// CORS Configuration: Configures which domains can access the server
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200'; // The frontend's URL (default to local development URL if not provided)
app.use(cors({
  origin: FRONTEND_URL, // Allows only requests from the specified frontend URL
  credentials: true // Allows sending cookies along with requests from the frontend
}));

// JSON Middleware: Parses incoming requests with JSON payloads
app.use(express.json()); // Automatically parses JSON data from incoming requests

// Session Middleware: Handles user sessions (stores user data between requests)
app.use(session({
  secret: 'your_secret_key', // Secret key used to sign the session ID cookie
  resave: false, // Don't resave session if it wasn't modified
  saveUninitialized: false, // Don't store sessions that are not modified (i.e., prevent empty sessions from being saved)
  cookie: {
    secure: false, // Set to true if using HTTPS to ensure cookies are sent over secure connections
    httpOnly: true, // Makes cookies accessible only via HTTP(S), preventing client-side JavaScript access
    maxAge: 1000 * 60 * 60 * 24 // Sets the cookie expiration time (1 day in milliseconds)
  }
}));

// Route Handlers
app.use('/api/games', gamesRoute); // All routes under /api/games will be handled by the gamesRoute
app.use('/api/slot', slotRoute); // All routes under /api/slot will be handled by the slotRoute

// Error Handling Middleware: Catches any unhandled errors in the app
app.use(errorHandler); // Custom error handler to manage and respond to errors

// Start the server and listen for incoming requests
const PORT = process.env.PORT || 5000; // Port to run the server (use PORT from environment or default to 5000)
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Log that the server is running
});
