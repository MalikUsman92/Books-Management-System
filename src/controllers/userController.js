const { user: authUser } = require('./authController');
const { 
    checkForBan, 
    banUserLib, 
    totalBorrowedByUser, 
    booksBorrowedByUser, 
    checkFine, 
    unbanUserLib 
} = require('../lib/userLib');

const userProfile = async(req, res) => {
    const user = authUser(); // Assuming authUser is a function that returns a user object
    const role = user.role;
    const id = user.id;
    const email = user.userEmail;

    // Get total books borrowed by the user till date
    
        const totalBooksResult = await totalBorrowedByUser(req,res, email)
        const totalBorrowedBooks = totalBooksResult[0].total_borrowed_books;

        const borrowedBooksResults = await booksBorrowedByUser(req,res, email)
        const borrowedBooks = borrowedBooksResults.map(book => ({
            book_id: book.book_id,
            book_name: book.book_name,
            borrowed_date: book.borrowed_date,
            expected_returned_date : book.return_date
        }));
        const finesResults = await checkFine(req,res,email)
        const pendingFines = finesResults[0].pending_fines || 0;
                        res.status(200).json({
                            user_id: id,
                            username: email,
                            total_borrowed_books: totalBorrowedBooks,
                            borrowed_books: borrowedBooks,
                            pending_fines: pendingFines
                        });     
}

const banUser = async(req, res) => {
    try { 
        let responseMessage = '';
        const currentDate = new Date().toISOString().split('T')[0]; 
        const oneWeekAgo = new Date(); 
        oneWeekAgo.setDate(currentDate.getDate() - 7) 
        const results = await checkForBan(req,res,oneWeekAgo);
        console.log(results);
        banUserLib(req,res,results)    
    } catch (err) {
        console.error('Error checking overdue books:', err);
    }
}

const unbanUser = async(req, res) => {
    try {
        const {id} = req.params;
        unbanUserLib(req,res,id)  
    } catch (err) {
        console.error('Error checking overdue books:', err);
    }
}

module.exports = { userProfile ,banUser, unbanUser }