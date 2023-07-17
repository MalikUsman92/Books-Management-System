const express = require('express'); // Importing Express framework
const authController = require('../controllers/authController'); // Importing user controller
const { registerValidation, loginValidation } = require('../validation/authValidation.js'); // Importing validation functions
const validate = require('../service/validationMiddleware.js'); // Importing validation middleware

const router = express.Router(); // Creating an instance of Express router

// Routes to manage User Register and Login
router.post('/register', registerValidation, validate, authController.register); // Route for user registration
router.post('/login', loginValidation, validate, authController.login); // Route for user login

module.exports = router; // Exporting the router
