const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// All routes require authentication
router.use(authMiddleware);

// Current user endpoints
router.get('/me', userController.getCurrentUser);
router.put('/me', userController.updateCurrentUser);
router.put('/me/password', userController.changePassword);

// Admin-only routes
router.get('/', isAdmin, userController.getAllUsers);
router.get('/:id', isAdmin, userController.getUserById);
router.post('/', isAdmin, userController.createUser);
router.put('/:id', isAdmin, userController.updateUser);
router.put('/:id/password', isAdmin, userController.resetUserPassword);
router.delete('/:id', isAdmin, userController.deleteUser);

module.exports = router;