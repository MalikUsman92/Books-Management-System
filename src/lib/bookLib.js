const { con } = require('../database/dbconfig'); // Import the database connection
const queries = require('../database/dbQueries.js');// Import the database queries
// Get all books from the database
const getAllBooks = async (req, res) => {
    con.query(queries.getAllBooks, (err, result) => {
        try {
            // Return the result as JSON response
            res.status(200).json({ total_books: result });
            return result;
        } catch (err) {
            // Handle internal server error
            res.status(500).send('Internal Server Error: ' + err.message);
        }
    });
};
// Search for books in the library
const searchBooksLib = async (searchFields, req, res) => {
    con.query(queries.searchBooks, [searchFields.book_name, searchFields.author_name, searchFields.genre], (err, result) => {
        try {
            // Return the search results as response
            res.status(200).send(result);
        } catch (err) {
            // Handle internal server error
            res.status(500).send('Internal Server Error: ' + err.message);
        }
    });
};
// Get status of books in the library
const getBookStatusLib = async (req, res) => {
    try {
        con.query(queries.getAllBooks, (err, results) => {
            const totalBooks = results;
            con.query(queries.getBorrowedBooks, (err, results) => {
                const borrowedBooks = results.map((book) => ({
                    book_name: book.book_name,
                    borrowed_date: book.borrowed_date,
                }));
                con.query(queries.getPendingBooks, (err, results) => {
                    const pendingBooks = results.map((book) => ({
                        book_name: book.book_name,
                        borrowed_date: book.borrowed_date,
                    }));
                    // Return the book status as response
                    res.status(200).json({
                        total_books: totalBooks,
                        borrowed_books: borrowedBooks,
                        pending_books: pendingBooks,
                    });
                });
            });
        });
    } catch (err) {
        // Handle internal server error
        res.status(500).send('Internal Server Error: ' + err.message);
    }
};
// Search for book availability by ID
const searchBookAvalability = async (req, res, id) => {
    return new Promise((resolve, reject) => {
        con.query(queries.findBookById, [id], (err, results) => {
            if (err) {
                console.error('Failed to execute database query:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
// Search for borrowed book availability by ID and email
const searchBorrowedBookAvalability = async (req, res, searchFields) => {
    return new Promise((resolve, reject) => {
        console.log(searchFields.email);
        con.query(queries.findBorrowedBookById, [searchFields.id, searchFields.email], (err, results) => {
            if (err) {
                console.error('Failed to execute database query:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
// Add a book to the library
const addBookLib = async (req, res, addFields) => {
    con.beginTransaction(async (err) => {
        try {
            con.query(queries.addIntoBook, [addFields.book_name, addFields.genre], (err, result) => {
                const bookId = result.insertId;
                con.query(queries.addIntoAuthor, [addFields.author_name], (err, result) => {
                    const authorId = result.insertId;
                    con.query(queries.addBookAuthor, [bookId, authorId], () => {
                        con.commit(() => {
                            // Return success message
                            res.status(201).send({ message: 'Book added successfully!' });
                        });
                    });
                });
            });
        } catch (err) {
            // Handle internal server error and rollback transaction
            con.rollback();
            res.status(500).send('Internal Server Error: ' + err.message);
        }
    });
};
// Add a book to the author in the library
const addBookToAuthorLib = async (req, res, addFields, authorId) => {
    con.beginTransaction(async (err) => {
        try {
            con.query(queries.addIntoBook, [addFields.book_name, addFields.genre], (err, result) => {
                con.query(queries.addBookAuthor, [result.insertId, authorId], () => {
                    con.commit(() => {
                        // Return success message
                        res.status(201).send({ message: 'Book added successfully!' });
                    });
                });
            });
        } catch (err) {
            // Handle internal server error and rollback transaction
            con.rollback();
            res.status(500).send('Internal Server Error: ' + err.message);
        }
    });
};
// Update a book in the library
const updateBookLib = async (updateFields, id, req, res) => {
    // Update the book in the database
    con.query(queries.updateBook, [updateFields, id], (err, result) => {
        try {
            // Check if the book was found and updated
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Book not found' });
            } else {
                // Return success message
                res.status(200).json({ message: 'Book updated successfully' });
            }
        } catch (err) {
            // Handle error while updating book
            return res.status(500).json({ error: 'Failed to update book' + err });
        }
    });
};
// Borrow a book from the library
const borrowBookLib = async (req, res, borrowFields) => {
    con.query(
        queries.borrowBook,
        [borrowFields.email, borrowFields.borrowedDate,borrowFields.returnDate, borrowFields.id],
        (err, results) => {
            if (err) {
                console.error('Error updating book status:', err);
                res.sendStatus(500);
                return;
            }
            // Return success message
            res.status(200).send('Book borrowed by user : ' + borrowFields.email);
        }
    );
};
// Check for pending books in the library
// const checkForPendingBook = async (req, res, currentDate) => {
//     return new Promise((resolve, reject) => {
//         con.query(queries.checkForPendBooks, [currentDate], (err, results) => {
//             if (err) {
//                 console.error('Failed to execute database query:', err);
//                 reject(err);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// };
// Update borrow status for pending books in the library
const updateBorrowStatus = async (req, res, results) => {
    if (results.length > 0) {
        for (const books of results) {
            con.query(`UPDATE books SET book_status ='pending' WHERE book_id = ? `, [books.book_id]);
        }
    } else {
        responseMessage = 'No users to ban.';
    }
};
// Return a book to the library
const returnBookLib = async (req, res, id, fines) => {
    con.query(queries.returnBook, [id], (err, results) => {
        if (err) {
            console.error('Error updating book status:', err);
            res.sendStatus(500);
            return;
        }

        if (fines > 0) {
            con.query('UPDATE users SET fine = ?', [fines]);
            // Return message with fine amount
            res.status(200).send(`Book returned. Fine: Rs ${fines}`);
        } else {
            // Return success message
            res.status(200).send('Book Returned Successfully');
        }
    });
};
// Delete a book from the library
const deleteBookLib = async (id, req, res) => {
    con.beginTransaction(async (err) => {
        try {
            await con.query(queries.deleteBookAuthor, id);
            con.query(queries.deleteBook, [id], (err, result) => {
                try {
                    if (result.affectedRows === 0) {
                        return res.status(404).json({ error: 'Book not found' });
                    } else {
                        con.query(queries.deleteAuthor, id);
                        // Return success message
                        res.status(200).send({ message: 'Book deleted successfully!' });
                    }
                } catch (err) {
                    // Handle internal server error
                    res.status(500).send('Internal Server Error: ' + err.message);
                }
            });
        } catch (err) {
            // Handle internal server error and rollback transaction
            con.rollback(() => {
                res.status(500).send('Internal Server Error: ' + err.message);
            });
        }
    });
};
// Export all the functions as module exports
module.exports = {
    addBookLib,
    addBookToAuthorLib,
    updateBookLib,
    deleteBookLib,
    getAllBooks,
    searchBooksLib,
    getBookStatusLib,
    searchBookAvalability,
    searchBorrowedBookAvalability,
    borrowBookLib,
    returnBookLib,
    // checkForPendingBook,
    updateBorrowStatus
};
