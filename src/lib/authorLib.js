const { con } = require('../database/dbconfig'); // Importing the database configuration object
const queries = require('../database/dbQueries.js'); // Importing database queries

const searchAuthorByNameLib = (req, res, name) => {
    return new Promise((resolve, reject) => {
        con.query(queries.searchAuthorByName, [name], (err, results) => { // Performing a database query to search for an author by name
            if (err) {
                console.error('Failed to execute database query:', err);
                reject(err);
            } else {
                resolve(results.length > 0 ? results[0] : null); // Resolving the promise with the first result if available, otherwise null
            }
        });
    });
}

const searchAuthorLib = (req, res, id) => {
    return new Promise((resolve, reject) => {
        con.query(queries.searchAuthorById, [id], (err, results) => { // Performing a database query to search for an author by ID
            if (err) {
                console.error('Failed to execute database query:', err);
                reject(err);
            } else {
                resolve(results); // Resolving the promise with the query results
            }
        });
    });
}

const getAuthorLib = (req, res, id, results) => {
    const author = results[0];
    con.query(queries.getAuthorById, [id], (err, result) => { // Performing a database query to get author details by ID
        if (err) {
            res.status(500).json({ error: 'Error querying database' });
            return;
        }
        const books = result.map(book => ({ // Mapping the query results to a new format
            book_id: book.book_id,
            book_name: book.book_name,
            genre: book.genre
        }));
        res.status(200).json({
            author_id: author.author_id,
            author_name: author.author_name,
            age: author.age,
            about: author.about,
            total_books: books.length,
            books: books
        }); // Sending the author details and associated books as a JSON response
    });
}

const addAuthorToBookLib = async (req, res, addAuthorFields) => {
    con.beginTransaction(async (err) => { // Starting a database transaction
        try {
            // Insert author into the authors table
            con.query('INSERT INTO authors (author_name) VALUES (?);', [addAuthorFields.author_name], (err, result) => {
                if (err) {
                    con.rollback(); // Rolling back the transaction in case of an error
                }

                // Insert book-author relationship into book_authors table
                con.query('INSERT INTO book_authors (book_id, author_id) VALUES (?, ?);', [addAuthorFields.id, result.insertId], (err) => {
                    if (err) {
                        con.rollback(); // Rolling back the transaction in case of an error
                    }
                    con.commit((err) => {
                        if (err) {
                            con.rollback(); // Rolling back the transaction in case of an error
                        }
                        res.status(201).send({ message: 'Author added to the book successfully!' }); // Sending a success response
                    });
                });
            });
        }
        catch (err) {
            res.status(500).send('Internal Server Error: ' + err.message); // Handling any exceptions and sending an error response
        }
    })
};

const updateAuthorLib = async (updateFields, id, req, res) => {
    con.query(queries.updateAuthor, [updateFields, id], (err, results) => { // Performing a database query to update author details
        if (err) {
            console.error('Failed to execute database query:', err);
        } else {
            res.status(201).send('Author Updated'); // Sending a success response
        }
    });
}

module.exports = { addAuthorToBookLib, searchAuthorLib, getAuthorLib, searchAuthorByNameLib, updateAuthorLib }; // Exporting the functions
