const bcrypt = require('bcrypt'); // Import the bcrypt library for password hashing

// Function to hash a password
const hashPassword = async (password) => {
    try {
        const hashed = await bcrypt.hash(password, 10); // Generate a hash of the password with salt rounds
        return hashed; // Return the hashed password
    } catch (error) {
        throw new Error('Failed to hash password'); // Throw an error if hashing fails
    }
};

// Function to compare a password with a hashed password
const comparePasswords = (password, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                console.error('Failed to compare passwords:', err); // Log error if password comparison fails
                reject(err); // Reject the promise with the error
            } else {
                resolve(isMatch); // Resolve the promise with the result of password comparison
            }
        });
    });
};
module.exports = { hashPassword, comparePasswords }; // Export the functions for use in other files
