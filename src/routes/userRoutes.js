const express = require('express'); // Importing express module
const bookController = require('../controllers/bookController'); // Importing bookController module
const authorController = require('../controllers/authorController.js'); // Importing authorController module
const userController = require('../controllers/userController.js'); // Importing userController module

const router = express.Router(); // Creating a router instance

// Routes to manage books
router.get('/books', bookController.getBooks); // GET request to retrieve all books
router.get('/books/search', bookController.searchBooks); // GET request to search books

router.put('/books/borrow/:id', bookController.borrowBook); // PUT request to borrow a book by ID
router.put('/books/return/:id', bookController.returnBook); // PUT request to return a borrowed book by ID

// Routes related to user and author
router.get('/profile', userController.userProfile); // GET request to retrieve user profile
router.get('/author', authorController.getAllAuthor); // GET request to retrieve all authors
router.get('/author/:id', authorController.getAuthor); // GET request to retrieve author by ID

module.exports = router; // Exporting the router
