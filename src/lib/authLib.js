const { con } = require('../database/dbconfig'); // Connection configuration for the database
const queries = require('../database/dbQueries.js'); // SQL queries for interacting with the database

// Library function for registering a user
const registerLib = (registerFields, req, res) => {
    con.query(queries.registerUser, [registerFields.name, registerFields.email, registerFields.password, registerFields.role], (err, results) => {
        if (err) {
            // If there's an error during registration, log and return an error response
            console.error('Failed to register user:', err);
            res.status(500).json({ error: err.message });
        } 
    });
};

// Library function for searching a user by email
const searchUserLib =  async(Fields) => {
    return new Promise((resolve, reject) => {
        con.query(queries.findUserByEmail, [Fields.email], (err, results) => {
            if (err) {
                // If there's an error executing the database query, log and reject the promise
                console.error('Failed to execute database query:', err);
                reject(err);
            } else {
                // If the query is successful, resolve the promise with the results
                resolve(results);
            }
        });
    });
};

// Exporting the library functions
module.exports = { registerLib, searchUserLib };
