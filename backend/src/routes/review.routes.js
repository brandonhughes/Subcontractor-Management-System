const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');
const reviewController = require('../controllers/review.controller');

// Public routes
router.get('/subcontractor/:subcontractorId', reviewController.getReviewsBySubcontractorId);

// Protected routes (require authentication)
router.use(authMiddleware);

// Internal user routes
router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.post('/:id/attachments', reviewController.uploadAttachment);
router.delete('/:id/attachments/:attachmentId', reviewController.deleteAttachment);

// Admin-only routes
router.delete('/:id', isAdmin, reviewController.deleteReview);

module.exports = router;