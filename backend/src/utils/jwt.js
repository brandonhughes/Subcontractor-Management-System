const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object with id, username, email, and role
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * Verify a JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};