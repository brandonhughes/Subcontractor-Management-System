const { User } = require('../models');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    logger.error('Error retrieving current user:', error);
    res.status(500).json({ message: 'Failed to retrieve user information' });
  }
};

// Update current user
exports.updateCurrentUser = async (req, res) => {
  try {
    const { name, email, department, phoneNumber } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update only allowed fields
    await user.update({
      name,
      email,
      department,
      phoneNumber
    });
    
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      message: 'User profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await user.update({ password: hashedPassword });
    
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    logger.error('Error changing password:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
};

// Admin routes

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json(users);
  } catch (error) {
    logger.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error retrieving user with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to retrieve user' });
  }
};

// Create user (admin only)
exports.createUser = async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      firstName, 
      lastName, 
      role, 
      department, 
      status 
    } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    
    // Check if email already exists
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email is already in use' });
    }
    
    // Check if username already exists
    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username is already in use' });
    }
    
    // Create user (password hashing is handled by model hooks)
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || 'internal',
      department,
      status: status || 'active'
    });
    
    const newUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(e => e.message) 
      });
    }
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      username, 
      email, 
      firstName, 
      lastName, 
      role, 
      department, 
      status, 
      password 
    } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prepare update data
    const updateData = {
      username,
      email,
      firstName,
      lastName,
      role,
      department,
      status
    };

    // If password is provided, hash it
    if (password) {
      logger.info(`Updating password for user ${id}`);
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    
    // Update user
    await user.update(updateData);
    
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    logger.error(`Error updating user with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Reset user password (admin only)
exports.resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await user.update({ password: hashedPassword });
    
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    logger.error(`Error resetting password for user with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting own account
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.destroy();
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting user with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};