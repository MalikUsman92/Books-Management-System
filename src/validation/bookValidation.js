const { body, param, validationResult } = require('express-validator'); // Importing necessary functions from express-validator module

// Validation rules for adding a book
const addBookValidation = [
    body('book_name').notEmpty().withMessage('Book name is required'), // Validation rule: book_name should not be empty
    body('author_name').notEmpty().withMessage('Author name is required'), // Validation rule: author_name should not be empty
    body('genre').notEmpty().withMessage('Genre is required'), // Validation rule: genre should not be empty
];

// Validation rules for updating a book
const updateBookValidation = [
    param('id').notEmpty().withMessage('Book ID is required'), // Validation rule: id parameter should not be empty
    (req, res, next) => {
        const { book_name, genre } = req.body;
        if (!book_name && !genre) { // If neither book_name nor genre is provided in the request body
            return res.status(400).json({ error: 'No fields provided' }); // Return an error response
        }
        next();
    }
];

// Validation rules for searching books
const searchBooksValidation = [
    (req, res, next) => {
        const { book_name, author_name, genre } = req.body;
        if (!book_name && !genre && !author_name) { // If neither book_name, author_name, nor genre is provided in the request body
            return res.status(400).json({ error: 'No fields provided' }); // Return an error response
        }
        next();
    }
];

module.exports = {
    addBookValidation,
    updateBookValidation,
    searchBooksValidation
};
