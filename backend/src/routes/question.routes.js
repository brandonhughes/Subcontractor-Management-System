const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');
const questionController = require('../controllers/question.controller');

// Public routes - get questions for review form
router.get('/', questionController.getAllQuestions);
router.get('/categories', questionController.getAllCategories);
router.get('/categories/:id', questionController.getQuestionsByCategory);

// Protected routes (require authentication)
router.use(authMiddleware);

// Admin-only routes
router.post('/categories', isAdmin, questionController.createCategory);
router.put('/categories/:id', isAdmin, questionController.updateCategory);
router.delete('/categories/:id', isAdmin, questionController.deleteCategory);

router.post('/', isAdmin, questionController.createQuestion);
router.put('/:id', isAdmin, questionController.updateQuestion);
router.delete('/:id', isAdmin, questionController.deleteQuestion);

module.exports = router;