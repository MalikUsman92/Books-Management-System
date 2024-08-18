const { user: authUser } = require('./authController'); // Importing the user object from authController module
const {
    addBookLib, // Library function for adding a book
    addBookToAuthorLib, // Library function for adding a book to an author
    updateBookLib, // Library function for updating a book
    deleteBookLib, // Library function for deleting a book
    getAllBooks, // Library function for getting all books
    searchBooksLib, // Library function for searching books
    getBookStatusLib, // Library function for getting book status
    searchBookAvalability, // Library function for searching book availability
    searchBorrowedBookAvalability, // Library function for searching borrowed book availability
    borrowBookLib, // Library function for borrowing a book
    returnBookLib, // Library function for returning a book
    // checkForPendingBook, // Library function for checking pending books
    updateBorrowStatus // Library function for updating borrow status
} = require('../lib/bookLib.js'); // Importing functions from bookLib module

const { searchAuthorByNameLib } = require('../lib/authorLib'); // Importing searchAuthorByNameLib function from authorLib module


//To get all books 
const getBooks = (req, res) => {
    getAllBooks(req, res);
};

//To search book by author , name and genre
const searchBooks = (req, res) => {
    const {genre,book_name,author_name} = req.body;
    const searchFields = {
        book_name: book_name,
        author_name: author_name,
        genre: genre
    }
        searchBooksLib(searchFields, req, res);
    }

const getBooksStatus = async (req, res) => {
    getBookStatusLib(req,res);
}



const borrowBook = async(req, res) => {
    const user = authUser(); // Assuming authUser is a function that returns a user object
    const uid = user.id;
    const { id } = req.params;

    // Check if the book is available
    const results = await searchBookAvalability(req,res,id);
    if (results.length === 0) {
        res.status(404).send('Book not found');
        return;
    }
    const bookStatus = results[0].book_status;
    if (bookStatus === 'borrowed' || bookStatus === 'pending') {
        res.status(400).send('Book is already borrowed');
        return;
    }else{
    console.log(bookStatus)

        const borrowedDate = new Date().toISOString().split('T')[0];
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + 7);
        const formattedReturnDate = returnDate.toISOString().split('T')[0];

        // Update book status to borrowed and set the borrower's ID, borrowed date, and return date
        const borrowFields = {
            id: id,
            email: user.userEmail,
            borrowedDate: borrowedDate,
            returnDate: formattedReturnDate,
        };
        borrowBookLib(req,res,borrowFields);
    }
}

// const pendingBooks = async (req, res) => {
//     const currentDate = new Date().toISOString().split('T')[0]; 
//     // const results = await checkForPendingBook(req,res,currentDate);
//     updateBorrowStatus(req,res,results)

// }

const returnBook = async (req, res) => {
    const user = authUser(); // Assuming authUser is a function that returns a user object
    const uid = user.id;
    const email = user.userEmail;
    const { id } = req.params;
    searchFields = {
        id: id,
        email: email
    } 
    

    const results = await searchBorrowedBookAvalability(req,res,searchFields)
    // Check if the book is borrowed by the user
            if (results.length === 0) {
                res.status(404).send('Book not found or not borrowed by the user');
                return;
            }else{

            const returnDate = results[0].return_date;
            const currentDate = new Date();
            const timeDifference = currentDate.getTime() - new Date(returnDate).getTime();
            const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

            // Calculate fines if the book is returned late
            let fines = 0;
            if (daysDifference > 7) {
                fines = 100 * (daysDifference - 7);
            }
            returnBookLib(req,res,id,fines);
        }
            
            // Update book status to available and clear borrower's ID and borrowed date
            
}

//To add book
const addBook = async (req, res) => {
    const { book_name, author_name, genre } = req.body;
    const addFields = {
    }
    if (book_name) {
        addFields.book_name = book_name;
    }
    if (author_name) {
        addFields.author_name = author_name;
    }
    if (genre) {
        addFields.genre = genre;
    }
    if (Object.keys(addFields).length < 3) {
        return res.status(400).json({ error: 'You must be missing some data..!' });
    }
    try {
        const authorResult = await searchAuthorByNameLib(req, res, addFields.author_name);

        if (authorResult) {
            const authorId = authorResult.author_id;
            await addBookToAuthorLib(req, res, addFields, authorId);
        } else {
            addBookLib(req,res,addFields)
        }
    } catch (err) {
        res.status(500).send('Internal Server Error: ' + err.message);
    }
};

// Update a book
const updateBook = (req, res) => {
    const { id } = req.params;
    const { book_name, genre } = req.body;
    // Create object to store the fields to be updated
    const updateFields = {    };
    if (book_name) {
        updateFields.book_name = book_name;
    }
    if (genre) {
        updateFields.genre = genre;
    }
    updateBookLib(updateFields, id, req, res);
};
// To delete Book 
const deleteBook = (req, res) => {
    const bookId = req.params.id;
    deleteBookLib(bookId, req, res);
};


module.exports = { 
    getBooks, 
    searchBooks, 
    addBook, 
    deleteBook, 
    updateBook, 
    getBooksStatus, 
    borrowBook, 
    returnBook, 
    // pendingBooks
 };
