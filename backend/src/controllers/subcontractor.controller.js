const { Subcontractor, Document } = require('../models');
const logger = require('../utils/logger');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure file upload
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed.'));
    }
  }
}).single('file');

// Get all subcontractors with basic info
exports.getAllSubcontractors = async (req, res) => {
  try {
    const subcontractors = await Subcontractor.findAll({
      attributes: [
        'id', 
        'name', 
        'contactName', 
        'phone', 
        'email', 
        'specialties', 
        'averageRating', 
        'letterGrade',
        'status',
        'createdAt',
        'updatedAt'
      ]
    });
    
    res.status(200).json(subcontractors);
  } catch (error) {
    logger.error('Error retrieving subcontractors:', error);
    res.status(500).json({ message: 'Failed to retrieve subcontractors' });
  }
};

// Get subcontractor by ID with detailed info
exports.getSubcontractorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subcontractor = await Subcontractor.findByPk(id, {
      include: [{
        model: Document,
        as: 'documents'
      }]
    });
    
    if (!subcontractor) {
      return res.status(404).json({ message: 'Subcontractor not found' });
    }
    
    res.status(200).json(subcontractor);
  } catch (error) {
    logger.error(`Error retrieving subcontractor with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to retrieve subcontractor details' });
  }
};

// Create new subcontractor
exports.createSubcontractor = async (req, res) => {
  try {
    const {
      name,
      contactName,
      phone,
      email,
      address,
      specialties,
      description,
      website,
      status
    } = req.body;
    
    // Validation
    if (!name) {
      return res.status(400).json({ message: 'Company name is required' });
    }
    
    const newSubcontractor = await Subcontractor.create({
      name,
      contactName,
      phone,
      email,
      address,
      specialties,
      description,
      website,
      status: status || 'active',
      letterGrade: 'C', // Default grade for new subcontractors
      averageRating: 0,
      reviewCount: 0
    });
    
    res.status(201).json({
      message: 'Subcontractor created successfully',
      subcontractor: newSubcontractor
    });
  } catch (error) {
    logger.error('Error creating subcontractor:', error);
    res.status(500).json({ message: 'Failed to create subcontractor' });
  }
};

// Update subcontractor
exports.updateSubcontractor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subcontractor = await Subcontractor.findByPk(id);
    
    if (!subcontractor) {
      return res.status(404).json({ message: 'Subcontractor not found' });
    }
    
    const {
      name,
      contactName,
      phone,
      email,
      address,
      specialties,
      description,
      website,
      status
    } = req.body;
    
    // Validation
    if (!name) {
      return res.status(400).json({ message: 'Company name is required' });
    }
    
    await subcontractor.update({
      name,
      contactName,
      phone,
      email,
      address,
      specialties,
      description,
      website,
      status
    });
    
    res.status(200).json({
      message: 'Subcontractor updated successfully',
      subcontractor
    });
  } catch (error) {
    logger.error(`Error updating subcontractor with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update subcontractor' });
  }
};

// Delete subcontractor
exports.deleteSubcontractor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subcontractor = await Subcontractor.findByPk(id);
    
    if (!subcontractor) {
      return res.status(404).json({ message: 'Subcontractor not found' });
    }
    
    await subcontractor.destroy();
    
    res.status(200).json({ message: 'Subcontractor deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting subcontractor with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete subcontractor' });
  }
};

// Upload document for subcontractor
exports.uploadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subcontractor = await Subcontractor.findByPk(id);
    
    if (!subcontractor) {
      return res.status(404).json({ message: 'Subcontractor not found' });
    }
    
    upload(req, res, async (err) => {
      if (err) {
        logger.error('File upload error:', err);
        return res.status(400).json({ message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const { title, description } = req.body;
      
      const document = await Document.create({
        title: title || req.file.originalname,
        description,
        fileUrl: req.file.path,
        fileName: req.file.filename,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        subcontractorId: id
      });
      
      res.status(201).json({
        message: 'Document uploaded successfully',
        document
      });
    });
  } catch (error) {
    logger.error(`Error uploading document for subcontractor with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to upload document' });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const { id, documentId } = req.params;
    
    const document = await Document.findOne({
      where: {
        id: documentId,
        subcontractorId: id
      }
    });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Delete file from filesystem
    if (document.fileUrl && fs.existsSync(document.fileUrl)) {
      fs.unlinkSync(document.fileUrl);
    }
    
    await document.destroy();
    
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting document with id ${req.params.documentId}:`, error);
    res.status(500).json({ message: 'Failed to delete document' });
  }
};