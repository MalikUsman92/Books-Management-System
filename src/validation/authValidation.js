const { body } = require('express-validator'); // Importing body function from express-validator module

// Validation rules for user registration
const registerValidation = [
    body('name').notEmpty().withMessage('Name is required'), // Validation rule: name should not be empty
    body('email').isEmail().withMessage('Invalid email address'), // Validation rule: email should be a valid email address
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'), // Validation rule: password should be at least 4 characters long
    body('role').notEmpty().withMessage('Role is required'), // Validation rule: role should not be empty
];
// Validation rules for user login
const loginValidation = [
    body('email').isEmail().withMessage('Invalid email address'), // Validation rule: email should be a valid email address
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'), // Validation rule: password should be at least 4 characters long
];

module.exports = { registerValidation, loginValidation }; // Exporting the validation rules
