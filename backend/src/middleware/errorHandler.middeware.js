// Error handling middleware that catches errors in the application
const errorHandler = (err, req, res, next) => {
    // Log the error details to the console for debugging or monitoring
    console.error('Error:', err);

    // Send a response with the appropriate HTTP status code and error message
    res.status(err.status || 500).json({
        success: false,  // Indicates the operation was unsuccessful
        message: err.message || "Internal Server Error", // Error message; default to a generic message if not provided
    });
}

// Export the error handler middleware so it can be used in other parts of the application
module.exports = errorHandler;
