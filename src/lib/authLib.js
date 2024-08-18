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
const searchUserLib = async (fields) => {
    try {
        // Await the query execution and return the results
        const results = await new Promise((resolve, reject) => {
            con.query(queries.findUserByEmail, [fields.email], (err, results) => {
                if (err) {
                    // Log the error and reject the promise
                    console.error('Failed to execute database query:', err);
                    return reject(err);
                }
                // Resolve the promise with the query results
                console.log(results[0]);
                resolve(results);
            });
        });
        
        return results;
    } catch (error) {
        // Handle any errors that occur during the promise execution
        console.error('Error in searchUserLib:', error);
        throw error;
    }
};


// Exporting the library functions
module.exports = { registerLib, searchUserLib };
