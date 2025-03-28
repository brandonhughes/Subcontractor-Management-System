const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');
const subcontractorController = require('../controllers/subcontractor.controller');

// Public routes
router.get('/', subcontractorController.getAllSubcontractors);
router.get('/:id', subcontractorController.getSubcontractorById);

// Protected routes (require authentication)
router.use(authMiddleware);

// Admin-only routes
router.post('/', isAdmin, subcontractorController.createSubcontractor);
router.put('/:id', isAdmin, subcontractorController.updateSubcontractor);
router.delete('/:id', isAdmin, subcontractorController.deleteSubcontractor);
router.post('/:id/documents', isAdmin, subcontractorController.uploadDocument);
router.delete('/:id/documents/:documentId', isAdmin, subcontractorController.deleteDocument);

module.exports = router;