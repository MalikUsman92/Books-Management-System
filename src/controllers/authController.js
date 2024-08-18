const jwt = require('jsonwebtoken'); // Importing JWT for token generation and verification
const { registerLib, searchUserLib } = require('../lib/authLib.js'); // Importing user library functions
const { hashPassword, comparePasswords } = require('../service/bcrypt.js'); // Importing password hashing and comparison functions

var user = {
    user_role: null,
    id: null,
    userEmail: null
};

// User registration
const register = async (req, res, next) => {
    const { name, email, password, role } = req.body; // Extracting registration data from request body
    const hashedPassword = await hashPassword(password); // Hashing the password
    role.toUpperCase(); // Converting role to uppercase
    const registerFields = {
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
    }; // Creating registration data object
    const results = await searchUserLib(registerFields); // Checking if user already exists
    if (results.length === 0) { // If user does not exist
        registerLib(registerFields, req, res); // Registering the user
        res.status(201).json({ message: 'User Registration successful!', AS: role }); // Sending success response
    } else {
        res.status(401).json({ message: 'Something went wrong!! Try Again' }); // Sending error response
    }
};

// User login
const login = async (req, res, next) => {
    const { email, password } = req.body; // Extracting login data from request body
    const loginFields = {
        email: email,
        password: password
    }; // Creating login data object
    try {
        const results = await searchUserLib(loginFields); // Searching for user
        if (results.length === 0) {
            return res.status(401).json({ message: 'User does not exist' }); // User does not exist
        }
        if (results[0].status == 'blocked') {
            return res.status(401).json({ message: 'User is blocked! Contact Administration' }); // User does not exist
        }
        console.log(results[0].password)
        const isMatch = await comparePasswords(loginFields.password, results[0].user_password); // Comparing passwords
        if (isMatch) { // Passwords match
            user.role = results[0].user_role.toLowerCase();
            user.id = results[0].user_id;
            user.userEmail = results[0].user_email;
            const token = jwt.sign({ results: results[0].user_email, user_role: user.role }, "jwtSecret", { expiresIn: '800s' }); // Generating JWT token
            console.log(user.role, user.id, user.userEmail, token); // Logging user details and token
            return res.status(200).json({ message: 'Login successful!', user_role: user.role, token: token }); // Sending success response with token
        } else {
            return res.status(401).json({ message: 'Invalid Details' }); // Invalid email or password
        }
    } catch (err) {
        console.error('Error:', err); // Logging error
        return res.status(500).json({ error: 'Internal Server Error' }); // Sending error response
    }
};

module.exports = { register, login, user: () => user }; // Exporting register, login functions, and user object

