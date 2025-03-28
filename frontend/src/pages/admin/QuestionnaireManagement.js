import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Tabs, Tab, Divider, Button, IconButton,
  List, ListItem, ListItemText, ListItemSecondaryAction, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, FormControl,
  InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Chip,
  CircularProgress, Snackbar, Alert, Grid, Card, CardContent, CardActions,
  Accordion, AccordionSummary, AccordionDetails, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  DragIndicator as DragIndicatorIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { apiService } from '../../services/api';

const QuestionnaireManagement = () => {
  // State for overall management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Dialog states
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] = useState(false);
  const [openDeleteQuestionDialog, setOpenDeleteQuestionDialog] = useState(false);
  
  // Form data
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    weight: 1.0,
    displayOrder: 0,
    isActive: true
  });
  
  const [questionFormData, setQuestionFormData] = useState({
    text: '',
    weight: 1.0,
    helpText: '',
    isRequired: true,
    displayOrder: 0,
    isActive: true,
    categoryId: ''
  });
  
  // Selected items for edit/delete
  const [selectedCategoryForAction, setSelectedCategoryForAction] = useState(null);
  const [selectedQuestionForAction, setSelectedQuestionForAction] = useState(null);
  
  // Snackbar notification
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load categories and questions data
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiService.getQuestionCategories();
      setCategories(response.data);
      setError(null);
      
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0].id);
        fetchQuestions(response.data[0].id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching question categories:', err);
      setError('Failed to fetch question categories. Please try again.');
      showSnackbar('Failed to fetch question categories', 'error');
      setLoading(false);
    }
  };

  // Fetch questions for a specific category
  const fetchQuestions = async (categoryId) => {
    setLoading(true);
    try {
      const response = await apiService.getQuestionsByCategory(categoryId);
      setQuestions(response.data);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error(`Error fetching questions for category ${categoryId}:`, err);
      setError('Failed to fetch questions. Please try again.');
      showSnackbar('Failed to fetch questions', 'error');
      setLoading(false);
    }
  };

  // Handle category selection change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchQuestions(categoryId);
  };

  // Category form handlers
  const handleCategoryInputChange = (e) => {
    const { name, value, checked } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      [name]: name === 'isActive' ? checked : value
    });
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      description: '',
      weight: 1.0,
      displayOrder: 0,
      isActive: true
    });
  };

  // Question form handlers
  const handleQuestionInputChange = (e) => {
    const { name, value, checked } = e.target;
    setQuestionFormData({
      ...questionFormData,
      [name]: name === 'isRequired' || name === 'isActive' ? checked : value
    });
  };

  const resetQuestionForm = () => {
    setQuestionFormData({
      text: '',
      weight: 1.0,
      helpText: '',
      isRequired: true,
      displayOrder: 0,
      isActive: true,
      categoryId: selectedCategory
    });
  };

  // Dialog open/close handlers
  const handleOpenCategoryDialog = (category = null) => {
    if (category) {
      setSelectedCategoryForAction(category);
      setCategoryFormData({
        name: category.name,
        description: category.description || '',
        weight: category.weight,
        displayOrder: category.displayOrder,
        isActive: category.isActive
      });
    } else {
      resetCategoryForm();
      setSelectedCategoryForAction(null);
    }
    setOpenCategoryDialog(true);
  };

  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
  };

  const handleOpenQuestionDialog = (question = null) => {
    if (question) {
      setSelectedQuestionForAction(question);
      setQuestionFormData({
        text: question.text,
        weight: question.weight,
        helpText: question.helpText || '',
        isRequired: question.isRequired,
        displayOrder: question.displayOrder,
        isActive: question.isActive,
        categoryId: question.categoryId
      });
    } else {
      resetQuestionForm();
      setQuestionFormData(prev => ({
        ...prev,
        categoryId: selectedCategory
      }));
      setSelectedQuestionForAction(null);
    }
    setOpenQuestionDialog(true);
  };

  const handleCloseQuestionDialog = () => {
    setOpenQuestionDialog(false);
  };

  const handleOpenDeleteCategoryDialog = (category) => {
    setSelectedCategoryForAction(category);
    setOpenDeleteCategoryDialog(true);
  };

  const handleCloseDeleteCategoryDialog = () => {
    setOpenDeleteCategoryDialog(false);
  };

  const handleOpenDeleteQuestionDialog = (question) => {
    setSelectedQuestionForAction(question);
    setOpenDeleteQuestionDialog(true);
  };

  const handleCloseDeleteQuestionDialog = () => {
    setOpenDeleteQuestionDialog(false);
  };

  // Snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // CRUD operations for categories
  const handleSaveCategory = async () => {
    if (!categoryFormData.name) {
      showSnackbar('Category name is required', 'error');
      return;
    }

    try {
      if (selectedCategoryForAction) {
        // Update existing category
        await apiService.updateQuestionCategory(selectedCategoryForAction.id, categoryFormData);
        showSnackbar('Category updated successfully');
      } else {
        // Create new category
        await apiService.createQuestionCategory(categoryFormData);
        showSnackbar('Category created successfully');
      }
      
      fetchCategories();
      handleCloseCategoryDialog();
    } catch (err) {
      console.error('Error saving category:', err);
      showSnackbar(err.response?.data?.message || 'Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategoryForAction) return;

    try {
      await apiService.deleteQuestionCategory(selectedCategoryForAction.id);
      showSnackbar('Category deleted successfully');
      fetchCategories();
      handleCloseDeleteCategoryDialog();
    } catch (err) {
      console.error('Error deleting category:', err);
      showSnackbar(
        err.response?.data?.message || 'Failed to delete category. Make sure it has no questions.',
        'error'
      );
    }
  };

  // CRUD operations for questions
  const handleSaveQuestion = async () => {
    if (!questionFormData.text) {
      showSnackbar('Question text is required', 'error');
      return;
    }

    try {
      if (selectedQuestionForAction) {
        // Update existing question
        await apiService.updateQuestion(selectedQuestionForAction.id, questionFormData);
        showSnackbar('Question updated successfully');
      } else {
        // Create new question
        await apiService.createQuestion(questionFormData);
        showSnackbar('Question created successfully');
      }
      
      fetchQuestions(selectedCategory);
      handleCloseQuestionDialog();
    } catch (err) {
      console.error('Error saving question:', err);
      showSnackbar(err.response?.data?.message || 'Failed to save question', 'error');
    }
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestionForAction) return;

    try {
      await apiService.deleteQuestion(selectedQuestionForAction.id);
      showSnackbar('Question deleted successfully');
      fetchQuestions(selectedCategory);
      handleCloseDeleteQuestionDialog();
    } catch (err) {
      console.error('Error deleting question:', err);
      showSnackbar(err.response?.data?.message || 'Failed to delete question', 'error');
    }
  };

  // Render the list of categories
  const renderCategories = () => {
    if (categories.length === 0) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body1">No categories found</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenCategoryDialog()}
            sx={{ mt: 2 }}
          >
            Add First Category
          </Button>
        </Box>
      );
    }

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h6">Categories</Typography>
          <Button 
            variant="contained" 
            size="small"
            startIcon={<AddIcon />} 
            onClick={() => handleOpenCategoryDialog()}
          >
            Add
          </Button>
        </Box>
        <Divider />
        <List>
          {categories.map((category) => (
            <ListItem 
              key={category.id} 
              button 
              selected={selectedCategory === category.id}
              onClick={() => handleCategoryChange(category.id)}
            >
              <ListItemText 
                primary={category.name} 
                secondary={`Weight: ${category.weight} ${!category.isActive ? '(Inactive)' : ''}`}
              />
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  aria-label="edit"
                  onClick={() => handleOpenCategoryDialog(category)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => handleOpenDeleteCategoryDialog(category)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  // Render the list of questions for the selected category
  const renderQuestions = () => {
    if (!selectedCategory) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body1">Please select or create a category first</Typography>
        </Box>
      );
    }

    if (questions.length === 0) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body1">No questions in this category</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenQuestionDialog()}
            sx={{ mt: 2 }}
          >
            Add First Question
          </Button>
        </Box>
      );
    }

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h6">Questions</Typography>
          <Button 
            variant="contained" 
            size="small"
            startIcon={<AddIcon />} 
            onClick={() => handleOpenQuestionDialog()}
          >
            Add
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question</TableCell>
                <TableCell align="center">Weight</TableCell>
                <TableCell align="center">Required</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>
                    <Typography variant="body2">{question.text}</Typography>
                    {question.helpText && (
                      <Typography variant="caption" color="textSecondary">
                        Help: {question.helpText}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">{question.weight}</TableCell>
                  <TableCell align="center">
                    {question.isRequired ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={question.isActive ? 'Active' : 'Inactive'}
                      color={question.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      aria-label="edit"
                      onClick={() => handleOpenQuestionDialog(question)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="delete"
                      onClick={() => handleOpenDeleteQuestionDialog(question)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Questionnaire Management
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ height: '100%' }}>
              {renderCategories()}
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ height: '100%' }}>
              {renderQuestions()}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Category Add/Edit Dialog */}
      <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCategoryForAction ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              name="name"
              label="Category Name"
              fullWidth
              value={categoryFormData.name}
              onChange={handleCategoryInputChange}
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={categoryFormData.description}
              onChange={handleCategoryInputChange}
            />
            <TextField
              name="weight"
              label="Weight"
              type="number"
              inputProps={{ min: 0.1, max: 10, step: 0.1 }}
              fullWidth
              value={categoryFormData.weight}
              onChange={handleCategoryInputChange}
              helperText="Weight factor for scoring (0.1 to 10)"
            />
            <TextField
              name="displayOrder"
              label="Display Order"
              type="number"
              inputProps={{ min: 0 }}
              fullWidth
              value={categoryFormData.displayOrder}
              onChange={handleCategoryInputChange}
              helperText="Order in which this category appears (lower numbers first)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="isActive"
                  checked={categoryFormData.isActive}
                  onChange={handleCategoryInputChange}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategoryDialog}>Cancel</Button>
          <Button onClick={handleSaveCategory} variant="contained">
            {selectedCategoryForAction ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Question Add/Edit Dialog */}
      <Dialog open={openQuestionDialog} onClose={handleCloseQuestionDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedQuestionForAction ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              name="text"
              label="Question Text"
              fullWidth
              value={questionFormData.text}
              onChange={handleQuestionInputChange}
            />
            <TextField
              name="helpText"
              label="Help Text"
              fullWidth
              multiline
              rows={2}
              value={questionFormData.helpText}
              onChange={handleQuestionInputChange}
              helperText="Additional information to help reviewers understand the question"
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={questionFormData.categoryId}
                label="Category"
                onChange={handleQuestionInputChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="weight"
              label="Weight"
              type="number"
              inputProps={{ min: 0.1, max: 10, step: 0.1 }}
              fullWidth
              value={questionFormData.weight}
              onChange={handleQuestionInputChange}
              helperText="Weight factor for scoring (0.1 to 10)"
            />
            <TextField
              name="displayOrder"
              label="Display Order"
              type="number"
              inputProps={{ min: 0 }}
              fullWidth
              value={questionFormData.displayOrder}
              onChange={handleQuestionInputChange}
              helperText="Order in which this question appears (lower numbers first)"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isRequired"
                    checked={questionFormData.isRequired}
                    onChange={handleQuestionInputChange}
                  />
                }
                label="Required"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="isActive"
                    checked={questionFormData.isActive}
                    onChange={handleQuestionInputChange}
                  />
                }
                label="Active"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQuestionDialog}>Cancel</Button>
          <Button onClick={handleSaveQuestion} variant="contained">
            {selectedQuestionForAction ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}
      <Dialog open={openDeleteCategoryDialog} onClose={handleCloseDeleteCategoryDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category "{selectedCategoryForAction?.name}"?
          </Typography>
          <Typography variant="caption" color="error">
            Note: You cannot delete a category that contains questions. Please delete or reassign any questions first.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteCategoryDialog}>Cancel</Button>
          <Button onClick={handleDeleteCategory} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Question Confirmation Dialog */}
      <Dialog open={openDeleteQuestionDialog} onClose={handleCloseDeleteQuestionDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the question "{selectedQuestionForAction?.text}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteQuestionDialog}>Cancel</Button>
          <Button onClick={handleDeleteQuestion} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuestionnaireManagement;