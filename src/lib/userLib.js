const { con } = require('../database/dbconfig'); // Import the database configuration
const queries = require('../database/dbQueries.js'); // Import the database queries

// Function to check if a user should be banned
const checkForBan = async (req, res, currentDate) => {
    return new Promise((resolve, reject) => {
        con.query(queries.checkForBan, [currentDate], (err, results) => {
            if (err) {
                console.error('Failed to execute database query:', err); // Log error if database query fails
                reject(err); // Reject the promise with the error
            } else {
                resolve(results); // Resolve the promise with the query results
            }
        });
    });
};

// Function to ban a user
const banUserLib = async (req, res, results) => {
    if (results.length > 0) {
        for (const books of results) {
            const user = books.email;
            con.query(queries.banUser, [user]); // Execute the database query to ban the user
            responseMessage = `User ${user} is blocked due to overdue book with ID ${books.book_id}`; // Create response message
        }
    } else {
        responseMessage = 'No users to ban.'; // Create response message if no users found
    }
    res.status(201).send(responseMessage); // Send the response message with status code 201
};

// Function to unban a user
const unbanUserLib = async (req, res, id) => {
    con.query(queries.unbanUser, [id], (err, result) => {
        if (err) {
            res.status(500).send('Failed to execute database query:', err); // Send error response if database query fails
        }
        res.status(201).send('User is unbanned'); // Send success response with status code 201
    });
};

// Function to get the total number of books borrowed by a user
const totalBorrowedByUser = async (req, res, email) => {
    return new Promise((resolve, reject) => {
        con.query(queries.totalBorrowedBooks, [email], (err, results) => {
            if (err) {
                console.error('Failed to execute database query:', err); // Log error if database query fails
                reject(err); // Reject the promise with the error
            } else {
                resolve(results); // Resolve the promise with the query results
            }
        });
    });
};

// Function to get the list of books borrowed by a user
const booksBorrowedByUser = async (req, res, email) => {
    return new Promise((resolve, reject) => {
        con.query(queries.booksBorrowedByUser, [email], (err, results) => {
            if (err) {
                console.error('Failed to execute database query:', err); // Log error if database query fails
                reject(err); // Reject the promise with the error
            } else {
                resolve(results); // Resolve the promise with the query results
            }
        });
    });
};

// Function to check if a user has any fines
const checkFine = async (req, res, email) => {
    return new Promise((resolve, reject) => {
        con.query(queries.checkFine, [email], (err, results) => {
            if (err) {
                console.error('Failed to execute database query:', err); // Log error if database query fails
                reject(err); // Reject the promise with the error
            } else {
                resolve(results); // Resolve the promise with the query results
            }
        });
    });
};

module.exports = {
    checkForBan,
    banUserLib,
    unbanUserLib,
    totalBorrowedByUser,
    booksBorrowedByUser,
    checkFine
}; // Export the functions for use in other files
