import React, { useState, useEffect, useContext } from 'react';
import { 
  Typography, Box, Paper, TextField, Button, MenuItem, 
  FormControl, FormLabel, FormControlLabel, RadioGroup, Radio,
  Divider, CircularProgress, Snackbar, Alert, Rating, Grid,
  Card, CardContent, Accordion, AccordionSummary, AccordionDetails,
  Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { apiService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const ReviewForm = () => {
  const { subcontractorId: urlSubcontractorId, reviewId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isNewReview = !reviewId;
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [subcontractors, setSubcontractors] = useState([]);
  const [selectedSubcontractorId, setSelectedSubcontractorId] = useState(urlSubcontractorId || '');
  const [selectedSubcontractor, setSelectedSubcontractor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [questionsWithResponses, setQuestionsWithResponses] = useState([]);
  const [generalComments, setGeneralComments] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDate, setProjectDate] = useState('');
  
  // Snackbar notification
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch subcontractors
        const subcontractorsResponse = await apiService.getSubcontractors();
        setSubcontractors(subcontractorsResponse.data);
        
        // Fetch question categories
        const categoriesResponse = await apiService.getQuestionCategories();
        setCategories(categoriesResponse.data);
        
        // Fetch all questions
        const questionsResponse = await apiService.getAllQuestions();
        
        // Initialize questions with default responses
        const initialQuestions = questionsResponse.data.map(question => ({
          ...question,
          response: {
            questionId: question.id,
            score: 3 // Default to middle rating
          }
        }));
        
        setQuestionsWithResponses(initialQuestions);
        
        // If we're editing an existing review, fetch it
        let reviewData = null;
        if (reviewId) {
          const reviewResponse = await apiService.getReview(reviewId);
          reviewData = reviewResponse.data;
          
          if (reviewData) {
            setSelectedSubcontractorId(reviewData.subcontractorId);
            setGeneralComments(reviewData.comments || '');
            setProjectName(reviewData.projectName || '');
            setProjectDate(reviewData.projectDate ? new Date(reviewData.projectDate).toISOString().split('T')[0] : '');
            
            // Map the responses to our questions
            const questionsWithExistingResponses = initialQuestions.map(question => {
              const existingResponse = reviewData.responses.find(r => r.questionId === question.id);
              if (existingResponse) {
                return {
                  ...question,
                  response: {
                    questionId: question.id,
                    score: existingResponse.score
                  }
                };
              }
              return question;
            });
            
            setQuestionsWithResponses(questionsWithExistingResponses);
          }
        }
        
        // If we have a subcontractor ID from URL or existing review, fetch that subcontractor
        if (urlSubcontractorId || (reviewId && reviewData?.subcontractorId)) {
          const subcontractorToUse = urlSubcontractorId || reviewData?.subcontractorId;
          const subcontractorResponse = await apiService.getSubcontractor(subcontractorToUse);
          setSelectedSubcontractor(subcontractorResponse.data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [reviewId, urlSubcontractorId]);
  
  // Fetch subcontractor details when selectedSubcontractorId changes
  useEffect(() => {
    const fetchSubcontractorDetails = async () => {
      if (!selectedSubcontractorId) {
        setSelectedSubcontractor(null);
        return;
      }
      
      try {
        const response = await apiService.getSubcontractor(selectedSubcontractorId);
        setSelectedSubcontractor(response.data);
      } catch (err) {
        console.error('Error fetching subcontractor details:', err);
        showSnackbar('Failed to fetch subcontractor details', 'error');
      }
    };
    
    fetchSubcontractorDetails();
  }, [selectedSubcontractorId]);
  
  // Handler for subcontractor selection
  const handleSubcontractorChange = (event) => {
    setSelectedSubcontractorId(event.target.value);
  };
  
  // Handler for question responses
  const handleResponseChange = (questionId, score) => {
    setQuestionsWithResponses(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, response: { ...q.response, score } } 
          : q
      )
    );
  };
  
  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // Handler for snackbar close
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };
  
  // Submit review
  const handleSubmit = async () => {
    if (!selectedSubcontractorId) {
      showSnackbar('Please select a subcontractor', 'error');
      return;
    }
    
    // Check if all required questions have responses
    const requiredQuestionsWithoutResponses = questionsWithResponses
      .filter(q => q.isRequired && (!q.response || !q.response.score));
    
    if (requiredQuestionsWithoutResponses.length > 0) {
      showSnackbar('Please answer all required questions', 'error');
      return;
    }
    
    // Prepare the data for submission
    const reviewData = {
      subcontractorId: selectedSubcontractorId,
      comments: generalComments,
      projectName,
      projectDate: projectDate ? new Date(projectDate).toISOString() : null,
      responses: questionsWithResponses
        .filter(q => q.response && q.response.score)
        .map(q => ({
          questionId: q.id,
          score: q.response.score
        }))
    };
    
    setSubmitting(true);
    try {
      if (isNewReview) {
        await apiService.createReview(reviewData);
        showSnackbar('Review submitted successfully');
      } else {
        await apiService.updateReview(reviewId, reviewData);
        showSnackbar('Review updated successfully');
      }
      
      // Navigate back to dashboard after a delay
      setTimeout(() => {
        navigate('/internal/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error submitting review:', err);
      showSnackbar(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Cancel and go back
  const handleCancel = () => {
    navigate('/internal/dashboard');
  };
  
  // Calculate overall rating based on responses
  const calculateOverallRating = () => {
    const responsesWithScores = questionsWithResponses.filter(q => q.response && q.response.score);
    if (responsesWithScores.length === 0) return 0;
    
    // Calculate weighted average
    const totalScore = responsesWithScores.reduce((sum, q) => sum + (q.response.score * (q.weight || 1)), 0);
    const totalWeight = responsesWithScores.reduce((sum, q) => sum + (q.weight || 1), 0);
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  };
  
  // Group questions by category for the form
  const questionsByCategory = categories.map(category => ({
    ...category,
    questions: questionsWithResponses.filter(q => q.categoryId === category.id)
  }));
  
  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isNewReview ? 'Submit a Review' : 'Edit Review'}
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Subcontractor Information</Typography>
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            select
            label="Select Subcontractor"
            value={selectedSubcontractorId}
            onChange={handleSubcontractorChange}
            disabled={!isNewReview || !!urlSubcontractorId}
            required
          >
            <MenuItem value="">
              <em>Select a subcontractor</em>
            </MenuItem>
            {subcontractors.map((subcontractor) => (
              <MenuItem key={subcontractor.id} value={subcontractor.id}>
                {subcontractor.name}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        
        {selectedSubcontractor && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1">
                    <strong>Company:</strong> {selectedSubcontractor.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Contact:</strong> {selectedSubcontractor.contactName || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {selectedSubcontractor.email || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {selectedSubcontractor.phone || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Specialties:</strong> {selectedSubcontractor.specialties?.join(', ') || 'N/A'}
                  </Typography>
                  {selectedSubcontractor.averageRating > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        <strong>Current Rating:</strong>
                      </Typography>
                      <Rating
                        value={selectedSubcontractor.averageRating}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <Chip
                        label={selectedSubcontractor.letterGrade || 'N/A'}
                        size="small"
                        sx={{ ml: 1, fontWeight: 'bold' }}
                        color={
                          selectedSubcontractor.letterGrade === 'A' ? 'success' :
                          selectedSubcontractor.letterGrade === 'B' ? 'primary' :
                          selectedSubcontractor.letterGrade === 'C' ? 'warning' :
                          selectedSubcontractor.letterGrade === 'D' ? 'error' :
                          selectedSubcontractor.letterGrade === 'F' ? 'error' :
                          'default'
                        }
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Project Name"
              fullWidth
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter the project name or reference"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Project Date"
              type="date"
              fullWidth
              value={projectDate}
              onChange={(e) => setProjectDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Questionnaire</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Please rate the subcontractor on the following criteria. All required questions must be answered.
        </Typography>
        
        {questionsByCategory.map((category) => (
          <Accordion key={category.id} defaultExpanded={true} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`category-${category.id}-content`}
              id={`category-${category.id}-header`}
            >
              <Typography variant="subtitle1">{category.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" paragraph>
                {category.description}
              </Typography>
              
              {category.questions.map((question) => (
                <Box key={question.id} sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {question.text}
                    {question.isRequired && (
                      <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>
                    )}
                  </Typography>
                  
                  {question.helpText && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {question.helpText}
                    </Typography>
                  )}
                  
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>Poor</Typography>
                      <Rating
                        name={`question-${question.id}`}
                        value={question.response?.score || 0}
                        onChange={(event, newValue) => {
                          handleResponseChange(question.id, newValue);
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>Excellent</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
              
              {category.questions.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No questions in this category.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>General Comments</Typography>
          <TextField
            label="Additional comments"
            multiline
            rows={4}
            fullWidth
            value={generalComments}
            onChange={(e) => setGeneralComments(e.target.value)}
            placeholder="Please provide any additional feedback or comments about your experience with this subcontractor"
          />
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>Overall Rating:</Typography>
            <Rating
              value={calculateOverallRating()}
              precision={0.5}
              readOnly
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              Based on your responses
            </Typography>
          </Box>
          
          <Box>
            <Button 
              variant="outlined" 
              onClick={handleCancel}
              sx={{ mr: 1 }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <CircularProgress size={24} />
              ) : (
                isNewReview ? 'Submit Review' : 'Update Review'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
      
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

export default ReviewForm;