// Import the validationResult function from express-validator to handle validation errors
const { validationResult } = require('express-validator');

// Middleware to validate incoming request data based on defined validation rules
const validateRequest = (req, res, next) => {
    // Use validationResult to check if any validation errors exist for the current request
    const errors = validationResult(req);

    // If there are validation errors, respond with a 400 Bad Request status and the error details
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // If no errors, proceed to the next middleware or route handler
    return next();
};

// Export the validateRequest middleware to be used in routes that require validation
module.exports = validateRequest;
