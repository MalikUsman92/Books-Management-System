const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    const token = req.get("authorization"); // Get the token from the request headers

    if (!token) {
        return res.status(401).json({ message: 'You Must Login First' }); // Return error if token is not provided
    }

    const Logtoken = token.slice(7); // Remove the 'Bearer ' prefix from the token
    jwt.verify(Logtoken, "jwtSecret", (err, decoded) => { // Verify the token
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Session expired' }); // Return error if token is expired
            } else {
                return res.status(401).json({ message: 'Invalid token' }); // Return error if token is invalid
            }
        }
        const { email, role } = decoded; // Extract email and role from the decoded token

        if (req.baseUrl.startsWith('/admin')) {
            // Verify admin role for admin routes
            if (role !== 'admin') {
                return res.status(403).json({ User: email, message: 'Unauthorized to perform this admin action' }); // Return error if user is not an admin
            }
        } else if (req.baseUrl.startsWith('/user')) {
            // Verify user role for user routes
            if (role !== 'user') {
                return res.status(403).json({ User: email, message: 'Unauthorized to perform this user action' }); // Return error if user is not a regular user
            }
        }

        req.user = decoded; // Attach the decoded user information to the request object
        next(); // Move to the next middleware or route handler
    });
};

module.exports = { authenticateUser };


