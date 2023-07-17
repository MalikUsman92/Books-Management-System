const { body, param, validationResult } = require('express-validator'); // Importing necessary functions from express-validator module

const addAuthorValidation = [
    param('id').notEmpty().withMessage('Book ID is required'),
    body('author_name').notEmpty().withMessage('Author name is required'), // Validation rule: author_name should not be empty
];

// Validation rules for updating a book
const updateAuthorValidation = [
    param('id').notEmpty().withMessage('Book ID is required'), // Validation rule: id parameter should not be empty
    (req, res, next) => {
        const { author_name, age, about } = req.body;
        if (!author_name && !age && !about) { // If neither book_name nor genre is provided in the request body
            return res.status(400).json({ error: 'No fields provided' }); // Return an error response
        }
        next();
    }
];

module.exports = {
    addAuthorValidation,
    updateAuthorValidation
};
