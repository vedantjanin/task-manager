// middleware/auth.js

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Please log in to continue'
    });
  }
  next(); // proceed if user is authenticated
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Please log in to continue'
    });
  }
  if (req.session.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access only'
    });
  }
  next(); // proceed if user is admin
};

module.exports = { isAuthenticated, requireAdmin };
