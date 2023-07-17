// User Related Queries

const registerUser = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
// SQL query to register a new user in the database

const findUserByEmail = 'SELECT * FROM users WHERE email = ?';
// SQL query to find a user by their email address

// Book Related Queries

const findBookById = 'SELECT book_status FROM books WHERE book_id = ?';
// SQL query to find a book's status by its ID

const findBorrowedBookById = `SELECT return_date FROM books 
                    WHERE book_id = ? AND borrowed_by_user_email = ?`;
// SQL query to find the return date of a borrowed book by its ID and the borrower's email

const getAllBooks = `SELECT books.*, authors.author_name
                    FROM authors
                    JOIN book_authors ON authors.author_id = book_authors.author_id
                    JOIN books ON book_authors.book_id = books.book_id LIMIT 10 `;
// SQL query to retrieve all books from the database, including the associated author information

const getBorrowedBooks = `SELECT books.book_name, books.borrowed_date
                    FROM books
                    WHERE books.book_status = 'borrowed' LIMIT 10`;
// SQL query to retrieve borrowed books from the database, including the book name and borrowed date

const getPendingBooks = `SELECT books.book_name, books.borrowed_date 
                    FROM books
                    WHERE books.book_status = "Pending" LIMIT 10`;
// SQL query to retrieve pending books from the database, including the book name and borrowed date

const searchBooks = `SELECT books.*, authors.author_name
                    FROM authors JOIN book_authors ON authors.author_id = book_authors.author_id
                    JOIN books ON book_authors.book_id = books.book_id
                    WHERE books.book_name = ? OR authors.author_name = ? OR books.genre = ? LIMIT 10;`;
// SQL query to search for books based on book name, author name, or genre

const borrowBook = `UPDATE books 
                    SET book_status = 'borrowed', borrowed_by_user_email = ?, borrowed_date = ?, return_date = ?
                    WHERE book_id = ?`;
// SQL query to update the status, borrower information, and dates of a book when borrowed

const checkForPendBooks = `SELECT books.* FROM books WHERE books.return_date < ?`;
// SQL query to check for books with pending return dates

const returnBook = `UPDATE books SET borrowed_by_user_email = NULL, borrowed_date = NULL, return_date = NULL, book_status = 'available' WHERE book_id = ?`;
// SQL query to update the borrower information, dates, and status of a book when returned

const addIntoBook = 'INSERT INTO books (book_name, genre) VALUES (?, ?);';
// SQL query to add a new book to the database
const addIntoAuthor = 'INSERT INTO authors (author_name) VALUES (?); ';
// SQL query to add a new author to the database
const addBookAuthor = 'INSERT INTO book_authors (book_id, author_id) VALUES (?, ?);';
// SQL query to associate a book with an author in the database

const deleteBook = 'DELETE FROM books WHERE book_id = ?';
// SQL query to delete a book from the database

const deleteBookAuthor = 'DELETE FROM book_authors WHERE book_id = ?';
// SQL query to delete the association between a book and its author from the database

const deleteAuthor = 'DELETE FROM authors WHERE author_id = ?';
// SQL query to delete an author from the database

const updateBook = 'UPDATE books SET ? WHERE book_id = ?';
// SQL query to update the details of a book in the database

const searchAuthorById = 'SELECT * FROM authors WHERE author_id = ?';
// SQL query to find an author by their ID

const searchAuthorByName = 'SELECT author_id FROM authors WHERE author_name = ?';
// SQL query to find an author by their name

const getAuthorById = `SELECT books.book_id, books.book_name, books.genre 
                    FROM authors 
                    JOIN book_authors ON authors.author_id = book_authors.author_id
                    JOIN books ON book_authors.book_id = books.book_id
                    WHERE authors.author_id =? limit 10;`;
// SQL query to retrieve books associated with an author by their ID

const updateAuthor = 'UPDATE authors SET ? WHERE author_id = ?';
// SQL query to update the details of an author in the database

// User-related Queries

const checkForBan = `SELECT books.*, users.email, users.user_id 
                    FROM books 
                    JOIN users ON books.borrowed_by_user_email = users.email 
                    WHERE books.return_date < ? AND users.status = 'active';`;
// SQL query to check for books with overdue return dates and active user status

const banUser =  `UPDATE users SET status ='blocked' WHERE email = ?`;
// SQL query to block a user by their email address

const unbanUser =  `UPDATE users SET status = 'active' WHERE user_id = ?`;
// SQL query to unblock a user by their user ID

const totalBorrowedBooks = 'SELECT COUNT(*) AS total_borrowed_books FROM books WHERE borrowed_by_user_email = ?';
// SQL query to retrieve the total number of books borrowed by a user

const booksBorrowedByUser = `SELECT books.book_id, books.book_name, books.borrowed_date FROM books WHERE books.borrowed_by_user_email = ? AND books.book_status = 'borrowed'`;
// SQL query to retrieve books borrowed by a user, including book ID, name, and borrowed date

const checkFine = `SELECT fine AS pending_fines FROM users WHERE email = ? `;
// SQL query to calculate the pending fines for a user based on the overdue borrowed books

module.exports = {
    registerUser,
    findUserByEmail,
    findBookById,
    findBorrowedBookById,
    returnBook,
    getAllBooks,
    getBorrowedBooks,
    getPendingBooks,
    searchBooks,
    borrowBook,
    checkForPendBooks,
    addIntoBook,
    addIntoAuthor,
    addBookAuthor,
    deleteBook,
    deleteBookAuthor,
    deleteAuthor,
    updateBook,
    searchAuthorById,
    searchAuthorByName,
    getAuthorById,
    updateAuthor,
    checkForBan,
    banUser,
    unbanUser,
    totalBorrowedBooks,
    booksBorrowedByUser,
    checkFine
};
