const express = require('express'); // Express framework for building web applications
const bodyParser = require('body-parser');
const cors = require('cors'); // Middleware for parsing request bodies
const env = require('dotenv'); // Module for managing environment variables
const { DbCon } = require('./database/dbconfig.js'); // Custom database configuration
const authRoutes = require('./routes/authRoutes'); // Routes for authentication
const adminRoutes = require('./routes/adminRoutes.js'); // Routes for admin operations
const userRoutes = require('./routes/userRoutes.js'); // Routes for user operations
const { authenticateUser } = require('../src/service/authMiddleware'); // Custom authentication middleware
const { banUser } = require('./controllers/userController.js'); //Function to check for user ban
const { pendingBooks } = require('./controllers/bookController.js'); //Function to check for pending books
env.config(); // Load environment variables
const PORT = process.env.PORT || 3004; // Port for server to listen on
const app = express(); // Create Express application

app.use(cors());
app.use(express.json()); // Parse incoming JSON data
app.use(bodyParser.json()); // Parse request bodies as JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Mounting routers
app.use('/', authRoutes); // Authentication routes
app.use('/admin', authenticateUser, adminRoutes); // Admin routes with authentication
app.use('/user', authenticateUser, userRoutes); // User routes with authentication

// Start the database connection
DbCon();
//Checks to ban Users
setInterval(banUser, 24 * 60 * 60 * 1000)
// setInterval(pendingBooks, 20 * 1000)
// Start the server
app.listen(PORT, () => {
    console.log(`Server listening at port http://localhost:${PORT}`);
});


