const express = require('express'); // Import the Express framework
const bookController = require('../controllers/bookController'); // Import the book controller module
const authorController = require('../controllers/authorController'); // Import the author controller module
const userController = require('../controllers/userController'); // Import the user controller module
const bookValidation = require('../validation/bookValidation.js'); // Import the book validation module
const authorValidation = require('../validation/authorValidation.js'); // Import the author validation module
const validate = require('../service/validationMiddleware.js'); // Import the validation middleware module

const router = express.Router(); // Create a new instance of the Express router

// Routes to perform CRUD Operations on books
router.get('/books', bookController.getBooks); // GET route to fetch all books
router.get('/books/search', bookValidation.searchBooksValidation, validate, bookController.searchBooks); // GET route to search books
router.get('/books/status', bookController.getBooksStatus); // GET route to fetch books status
router.post('/books/add', bookValidation.addBookValidation, validate, bookController.addBook); // POST route to add a new book
router.put('/books/update/:id', bookValidation.updateBookValidation, validate, bookController.updateBook); // PUT route to update a book
router.delete('/books/delete/:id', bookController.deleteBook); // DELETE route to delete a book

// Routes to perform operations on authors
router.post('/author/add/:id', authorValidation.addAuthorValidation, validate, authorController.addAuthorToBook); // POST route to add an author to a book
router.put('/author/update/:id', authorValidation.updateAuthorValidation, validate, authorController.updateAuthor); // PUT route to update author details

// Routes to manage users
router.put('/user/ban/', userController.banUser); // PUT route to ban a user
router.put('/user/unban/', userController.unbanUser); // PUT route to unban a user

module.exports = router; // Export the router module for use in other files

