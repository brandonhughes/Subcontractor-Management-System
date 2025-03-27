const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');
const logger = require('../utils/logger');

/**
 * Authentication middleware to verify JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Find user by id
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'User account is inactive' });
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

/**
 * Role-based authorization middleware
 * @param {String[]} roles - Array of allowed roles
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized: Insufficient privileges' });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};