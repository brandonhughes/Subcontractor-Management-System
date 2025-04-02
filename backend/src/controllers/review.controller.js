const { Review, ReviewResponse, ReviewAttachment, Question, Subcontractor, User, sequelize } = require('../models');
const logger = require('../utils/logger');
const multer = require('multer');
const fs = require('fs');

// Configure file upload
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const reviewDir = `${uploadDir}/reviews`;
    if (!fs.existsSync(reviewDir)) {
      fs.mkdirSync(reviewDir, { recursive: true });
    }
    cb(null, reviewDir);
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

// Calculate score
const calculateScore = async (subcontractorId) => {
  try {
    // Get all reviews for the subcontractor
    const reviews = await Review.findAll({
      where: { subcontractorId },
      include: [{
        model: ReviewResponse,
        as: 'responses',
        include: [{
          model: Question,
          as: 'question'
        }]
      }]
    });
    
    if (reviews.length === 0) {
      return null;
    }
    
    // Calculate weighted average score
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    reviews.forEach(review => {
      review.responses.forEach(response => {
        const weight = response.question.weight || 1;
        // Make sure we're using the score field
        const responseScore = response.score || 0;
        totalWeightedScore += responseScore * weight;
        totalWeight += weight;
      });
    });
    
    const averageScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    
    // Convert to 0-5 scale
    let normalizedScore = (averageScore * 5) / 5;
    normalizedScore = Math.min(Math.max(normalizedScore, 0), 5);
    
    // Determine letter grade
    let letterGrade;
    if (normalizedScore >= 4.5) {
      letterGrade = 'A';
    } else if (normalizedScore >= 3.5) {
      letterGrade = 'B';
    } else if (normalizedScore >= 2.5) {
      letterGrade = 'C';
    } else if (normalizedScore >= 1.5) {
      letterGrade = 'D';
    } else {
      letterGrade = 'F';
    }
    
    // Update subcontractor rating, letter grade, and review count
    await Subcontractor.update(
      {
        averageRating: normalizedScore, // Changed from "rating" to "averageRating" to match the model
        letterGrade,
        reviewCount: reviews.length     // Added to update the review count field
      },
      {
        where: { id: subcontractorId }
      }
    );
    
    return { score: normalizedScore, letterGrade };
  } catch (error) {
    logger.error('Error calculating score:', error);
    return null;
  }
};

// Get reviews by subcontractor ID
exports.getReviewsBySubcontractorId = async (req, res) => {
  try {
    const { subcontractorId } = req.params;
    
    const reviews = await Review.findAll({
      where: { subcontractorId },
      include: [
        {
          model: ReviewResponse,
          as: 'responses',
          include: [
            {
              model: Question,
              as: 'question',
              include: [
                {
                  model: sequelize.models.QuestionCategory,
                  as: 'category'
                }
              ]
            }
          ]
        },
        {
          model: ReviewAttachment,
          as: 'attachments'
        },
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'username', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(reviews);
  } catch (error) {
    logger.error(`Error retrieving reviews for subcontractor with id ${req.params.subcontractorId}:`, error);
    res.status(500).json({ message: 'Failed to retrieve reviews' });
  }
};

// Create review
exports.createReview = async (req, res) => {
  try {
    const { subcontractorId, comments, projectName, projectDate, responses } = req.body;
    
    // Validate required fields
    if (!subcontractorId || !responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Calculate overall rating from responses
    let totalRating = 0;
    let totalWeights = 0;
    
    for (const response of responses) {
      const question = await Question.findByPk(response.questionId);
      const weight = question ? (question.weight || 1) : 1;
      totalRating += (response.score || response.value) * weight;
      totalWeights += weight;
    }
    
    const overallRating = Math.round(totalWeights > 0 ? totalRating / totalWeights : 3);
    
    // Create review
    const review = await Review.create({
      subcontractorId,
      reviewerId: req.user.id, // Use reviewerId instead of userId to match the model
      overallRating: Math.min(Math.max(overallRating, 1), 5), // Ensure rating is between 1-5
      comments,
      projectName,
      projectDate
    });
    
    // Create review responses
    const reviewResponses = await Promise.all(responses.map(response => {
      return ReviewResponse.create({
        reviewId: review.id,
        questionId: response.questionId,
        score: response.score || response.value // Accept either score (from frontend) or value (for backward compatibility)
      });
    }));
    
    // Recalculate subcontractor score
    await calculateScore(subcontractorId);
    
    res.status(201).json({
      message: 'Review submitted successfully',
      review: {
        ...review.toJSON(),
        responses: reviewResponses
      }
    });
  } catch (error) {
    logger.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments, projectName, projectDate, responses } = req.body;
    
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user is the owner of the review or an admin
    if (review.reviewerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update this review' });
    }
    
    // Update responses first so we can calculate the overall rating
    if (responses && Array.isArray(responses)) {
      for (const response of responses) {
        await ReviewResponse.update(
          { score: response.score || response.value }, // Accept either score (from frontend) or value (for backward compatibility)
          {
            where: {
              reviewId: id,
              questionId: response.questionId
            }
          }
        );
      }
    
      // Calculate new overall rating
      let totalRating = 0;
      let totalWeights = 0;
      
      // Get updated responses
      const updatedResponses = await ReviewResponse.findAll({
        where: { reviewId: id },
        include: [{
          model: Question,
          as: 'question'
        }]
      });
      
      for (const response of updatedResponses) {
        const weight = response.question ? (response.question.weight || 1) : 1;
        totalRating += response.score * weight;
        totalWeights += weight;
      }
      
      const overallRating = Math.round(totalWeights > 0 ? totalRating / totalWeights : 3);
      
      // Update review with comments, project details, and new overall rating
      await review.update({ 
        comments,
        projectName,
        projectDate,
        overallRating: Math.min(Math.max(overallRating, 1), 5)
      });
    } else {
      // Just update comments and project details if no responses provided
      await review.update({ comments, projectName, projectDate });
    }
    
    // Recalculate subcontractor score
    await calculateScore(review.subcontractorId);
    
    const updatedReview = await Review.findByPk(id, {
      include: [
        {
          model: ReviewResponse,
          as: 'responses',
          include: [
            {
              model: Question,
              as: 'question'
            }
          ]
        },
        {
          model: ReviewAttachment,
          as: 'attachments'
        }
      ]
    });
    
    res.status(200).json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    logger.error(`Error updating review with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update review' });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user is an admin (middleware should handle this, but double-check)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this review' });
    }
    
    const subcontractorId = review.subcontractorId;
    
    // Delete review (cascade should delete responses and attachments)
    await review.destroy();
    
    // Recalculate subcontractor score
    await calculateScore(subcontractorId);
    
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting review with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
};

// Upload attachment
exports.uploadAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user is the owner of the review or an admin
    if (review.reviewerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update this review' });
    }
    
    upload(req, res, async (err) => {
      if (err) {
        logger.error('File upload error:', err);
        return res.status(400).json({ message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const { description } = req.body;
      
      const attachment = await ReviewAttachment.create({
        reviewId: id,
        fileUrl: req.file.path,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        description
      });
      
      res.status(201).json({
        message: 'Attachment uploaded successfully',
        attachment
      });
    });
  } catch (error) {
    logger.error(`Error uploading attachment for review with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to upload attachment' });
  }
};

// Delete attachment
exports.deleteAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;
    
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user is the owner of the review or an admin
    if (review.reviewerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update this review' });
    }
    
    const attachment = await ReviewAttachment.findOne({
      where: {
        id: attachmentId,
        reviewId: id
      }
    });
    
    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }
    
    // Delete file from filesystem
    if (attachment.fileUrl && fs.existsSync(attachment.fileUrl)) {
      fs.unlinkSync(attachment.fileUrl);
    }
    
    await attachment.destroy();
    
    res.status(200).json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting attachment with id ${req.params.attachmentId}:`, error);
    res.status(500).json({ message: 'Failed to delete attachment' });
  }
};