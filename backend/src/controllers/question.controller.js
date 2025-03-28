const { Question, QuestionCategory } = require('../models');
const logger = require('../utils/logger');

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      include: [{
        model: QuestionCategory,
        as: 'category'
      }],
      order: [
        [{ model: QuestionCategory, as: 'category' }, 'displayOrder', 'ASC'],
        ['displayOrder', 'ASC']
      ]
    });
    
    res.status(200).json(questions);
  } catch (error) {
    logger.error('Error retrieving questions:', error);
    res.status(500).json({ message: 'Failed to retrieve questions' });
  }
};

// Get all question categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await QuestionCategory.findAll({
      order: [['displayOrder', 'ASC']]
    });
    
    // If no categories exist, create a default one with a sample question
    if (categories.length === 0) {
      const defaultCategory = await QuestionCategory.create({
        name: 'General Feedback',
        description: 'General questions about the subcontractor',
        weight: 1.0,
        displayOrder: 0,
        isActive: true
      });
      
      // Create a default question in this category
      await Question.create({
        text: 'How satisfied are you with the quality of work the subcontractor did?',
        categoryId: defaultCategory.id,
        weight: 1.0,
        helpText: 'Consider factors like craftsmanship, attention to detail, and adherence to specifications',
        isRequired: true,
        displayOrder: 0,
        isActive: true
      });
      
      // Fetch categories again to include the newly created one
      const updatedCategories = await QuestionCategory.findAll({
        order: [['displayOrder', 'ASC']]
      });
      
      return res.status(200).json(updatedCategories);
    }
    
    res.status(200).json(categories);
  } catch (error) {
    logger.error('Error retrieving question categories:', error);
    res.status(500).json({ message: 'Failed to retrieve question categories' });
  }
};

// Get questions by category
exports.getQuestionsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const questions = await Question.findAll({
      where: { categoryId: id },
      order: [['displayOrder', 'ASC']]
    });
    
    res.status(200).json(questions);
  } catch (error) {
    logger.error(`Error retrieving questions for category with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to retrieve questions' });
  }
};

// Create question category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, displayOrder, weight, isActive } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    const category = await QuestionCategory.create({
      name,
      description,
      displayOrder: displayOrder || 0,
      weight: weight || 1,
      isActive: isActive !== undefined ? isActive : true
    });
    
    res.status(201).json({
      message: 'Question category created successfully',
      category
    });
  } catch (error) {
    logger.error('Error creating question category:', error);
    res.status(500).json({ message: 'Failed to create question category' });
  }
};

// Update question category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await QuestionCategory.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Question category not found' });
    }
    
    await category.update(req.body);
    
    res.status(200).json({
      message: 'Question category updated successfully',
      category
    });
  } catch (error) {
    logger.error(`Error updating question category with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update question category' });
  }
};

// Delete question category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await QuestionCategory.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Question category not found' });
    }
    
    // Check if there are questions in this category
    const questionCount = await Question.count({ where: { categoryId: id } });
    
    if (questionCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete category with associated questions. Please reassign or delete the questions first.'
      });
    }
    
    await category.destroy();
    
    res.status(200).json({ message: 'Question category deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting question category with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete question category' });
  }
};

// Create question
exports.createQuestion = async (req, res) => {
  try {
    const { text, categoryId, displayOrder, weight, helpText, isRequired, isActive } = req.body;
    
    // Validate required fields
    if (!text || !categoryId) {
      return res.status(400).json({ message: 'Question text and category are required' });
    }
    
    // Check if category exists
    const category = await QuestionCategory.findByPk(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Question category not found' });
    }
    
    const question = await Question.create({
      text,
      categoryId,
      displayOrder: displayOrder || 0,
      weight: weight || 1.0,
      helpText: helpText || null,
      isRequired: isRequired !== undefined ? isRequired : true,
      isActive: isActive !== undefined ? isActive : true
    });
    
    res.status(201).json({
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    logger.error('Error creating question:', error);
    res.status(500).json({ message: 'Failed to create question' });
  }
};

// Update question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const question = await Question.findByPk(id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    await question.update(req.body);
    
    res.status(200).json({
      message: 'Question updated successfully',
      question
    });
  } catch (error) {
    logger.error(`Error updating question with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update question' });
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const question = await Question.findByPk(id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if there are responses to this question (would need to add a check here if tracking responses)
    
    await question.destroy();
    
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting question with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete question' });
  }
};