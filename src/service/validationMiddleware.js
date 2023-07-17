const { validationResult } = require('express-validator'); // Importing validationResult from express-validator module

const validate = (req, res, next) => {
    const errors = validationResult(req); // Get validation errors from the request
    if (!errors.isEmpty()) { // If there are validation errors
        const errorMessages = errors.array().map((error) => error.msg); // Extract error messages
        return res.status(400).json({ error: errorMessages[0] }); // Return the first error message as response
    }
    next(); // Call next() to move to the next middleware or route handler
};

module.exports = validate; // Exporting the validation middleware
