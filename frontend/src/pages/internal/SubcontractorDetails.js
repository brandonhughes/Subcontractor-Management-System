import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Container, 
  Grid, 
  Chip, 
  Rating,
  Button,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Tooltip
} from '@mui/material';
import { 
  Phone as PhoneIcon, 
  Email as EmailIcon, 
  Language as WebsiteIcon,
  Business as BusinessIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Assignment as AssignmentIcon,
  RateReview as RateReviewIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

// Component for displaying category and question scores
const ScoreBreakdown = ({ reviews }) => {
  // Group responses by category and question
  const getCategoryScores = () => {
    // Initialize categories Map
    const categoriesMap = new Map();
    
    reviews.forEach(review => {
      if (!review.responses) return;
      
      review.responses.forEach(response => {
        if (!response.question) return;
        
        // Handle missing category relationship
        const question = response.question;
        const category = response.question.category || { 
          id: 'uncategorized', 
          name: 'Uncategorized',
          description: 'Questions without a category',
          weight: 1
        };
        
        if (!categoriesMap.has(category.id)) {
          categoriesMap.set(category.id, {
            id: category.id,
            name: category.name || 'Uncategorized',
            description: category.description || '',
            weight: category.weight || 1,
            questions: new Map(),
            totalScore: 0,
            count: 0
          });
        }
        
        const categoryData = categoriesMap.get(category.id);
        
        if (!categoryData.questions.has(question.id)) {
          categoryData.questions.set(question.id, {
            id: question.id,
            text: question.text,
            weight: question.weight,
            totalScore: 0,
            count: 0
          });
        }
        
        const questionData = categoryData.questions.get(question.id);
        questionData.totalScore += response.score;
        questionData.count += 1;
        
        categoryData.totalScore += response.score * (question.weight || 1);
        categoryData.count += (question.weight || 1);
      });
    });
    
    // Convert Maps to arrays and calculate averages
    return Array.from(categoriesMap.values()).map(category => {
      const questions = Array.from(category.questions.values()).map(question => ({
        ...question,
        averageScore: question.count > 0 ? question.totalScore / question.count : 0
      }));
      
      return {
        ...category,
        questions,
        averageScore: category.count > 0 ? category.totalScore / category.count : 0
      };
    });
  };
  
  const categoryScores = getCategoryScores();
  
  return (
    <Box mt={4}>
      <Typography variant="h6" component="h3" gutterBottom color="secondary.main">
        Performance by Category
      </Typography>
      
      {categoryScores.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No review data available for score breakdown.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {categoryScores.map(category => (
            <Grid item xs={12} key={category.id}>
              <Card 
                variant="outlined" 
                sx={{ 
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {category.name}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Rating
                        value={category.averageScore}
                        precision={0.1}
                        readOnly
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="subtitle1">
                        {category.averageScore.toFixed(1)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {category.description}
                  </Typography>
                  
                  <Box mt={2}>
                    {category.questions.map(question => (
                      <Box key={question.id} mb={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ width: '75%' }}>
                            {question.text}
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <Rating
                              value={question.averageScore}
                              precision={0.1}
                              readOnly
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Box>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(question.averageScore / 5) * 100}
                          sx={{ 
                            mt: 1, 
                            height: 8,
                            borderRadius: 1,
                            backgroundColor: 'background.default',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: 
                                question.averageScore >= 4 ? 'success.main' :
                                question.averageScore >= 3 ? 'info.main' :
                                question.averageScore >= 2 ? 'warning.main' : 'error.main'
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// Component for metrics section
const MetricsSection = ({ subcontractor, reviews }) => {
  // Calculate overall metrics
  const calculateMetrics = () => {
    if (!reviews || reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: [0, 0, 0, 0, 0],
        recentTrend: 'stable',
        topStrengths: [],
        areasForImprovement: []
      };
    }
    
    // Calculate rating distribution (1-5 stars)
    const ratingDistribution = [0, 0, 0, 0, 0];
    
    // Track all question responses to find strengths and weaknesses
    const questionScores = new Map();
    
    reviews.forEach(review => {
      // Skip if responses array is missing
      if (!review.responses || !Array.isArray(review.responses)) return;
      
      review.responses.forEach(response => {
        // Skip if response is missing score
        if (!response || typeof response.score !== 'number') return;
        
        // Add to rating distribution
        const starIndex = Math.min(Math.max(Math.floor(response.score) - 1, 0), 4);
        ratingDistribution[starIndex]++;
        
        // Skip if question data is missing
        if (!response.question) return;
        
        // Track question scores
        const questionId = response.question.id;
        if (!questionScores.has(questionId)) {
          questionScores.set(questionId, {
            id: questionId,
            text: response.question.text || 'Unknown Question',
            category: response.question.category?.name || 'Uncategorized',
            scores: []
          });
        }
        
        questionScores.get(questionId).scores.push(response.score);
      });
    });
    
    // Calculate average for each question
    const questionAverages = Array.from(questionScores.values()).map(question => {
      const sum = question.scores.reduce((a, b) => a + b, 0);
      return {
        ...question,
        averageScore: sum / question.scores.length
      };
    });
    
    // Find top strengths (highest scores)
    const topStrengths = [...questionAverages]
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3);
    
    // Find areas for improvement (lowest scores)
    const areasForImprovement = [...questionAverages]
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 3);
    
    // Determine recent trend
    // Sort reviews by date
    const sortedReviews = [...reviews].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    let recentTrend = 'stable';
    if (sortedReviews.length >= 2) {
      // Compare the most recent review's average score with the previous one
      const getAvgScore = (review) => {
        const responses = review.responses || [];
        if (responses.length === 0) return 0;
        
        const sum = responses.reduce((total, response) => total + response.score, 0);
        return sum / responses.length;
      };
      
      const mostRecentScore = getAvgScore(sortedReviews[0]);
      const previousScore = getAvgScore(sortedReviews[1]);
      
      if (mostRecentScore > previousScore + 0.5) {
        recentTrend = 'improving';
      } else if (mostRecentScore < previousScore - 0.5) {
        recentTrend = 'declining';
      }
    }
    
    return {
      totalReviews: reviews.length,
      averageRating: subcontractor.averageRating || 0,
      ratingDistribution,
      recentTrend,
      topStrengths,
      areasForImprovement
    };
  };
  
  const metrics = calculateMetrics();
  
  // Calculate percentages for rating distribution
  const totalRatings = metrics.ratingDistribution.reduce((sum, count) => sum + count, 0);
  const ratingPercentages = metrics.ratingDistribution.map(count => 
    totalRatings > 0 ? (count / totalRatings) * 100 : 0
  );
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 4,
        borderRadius: 0,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}
    >
      <Typography variant="h6" component="h3" gutterBottom color="secondary.main">
        Performance Metrics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary metrics */}
        <Grid item xs={12} md={4}>
          <Box 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center'
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Overall Rating
            </Typography>
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography 
                variant="h2" 
                component="div" 
                sx={{ fontWeight: 'bold', color: 'secondary.main' }}
              >
                {subcontractor.averageRating?.toFixed(1) || "N/A"}
              </Typography>
              <Rating
                value={subcontractor.averageRating || 0}
                precision={0.5}
                readOnly
                size="large"
              />
              <Box 
                sx={{ 
                  mt: 1,
                  bgcolor: 
                    subcontractor.letterGrade === 'A' ? 'success.main' :
                    subcontractor.letterGrade === 'B' ? 'info.main' :
                    subcontractor.letterGrade === 'C' ? 'warning.main' :
                    subcontractor.letterGrade === 'D' ? 'error.light' :
                    subcontractor.letterGrade === 'F' ? 'error.main' : 'grey.500',
                  color: 'white',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.75rem'
                }}
              >
                {subcontractor.letterGrade || 'N/A'}
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Based on {metrics.totalReviews} {metrics.totalReviews === 1 ? 'review' : 'reviews'}
            </Typography>
          </Box>
        </Grid>
        
        {/* Rating distribution */}
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Rating Distribution
            </Typography>
            {[5, 4, 3, 2, 1].map((star, index) => (
              <Box
                key={star}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1
                }}
              >
                <Box sx={{ minWidth: '30px', mr: 1 }}>
                  <Typography variant="body2">{star} ★</Typography>
                </Box>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={ratingPercentages[5 - star]}
                    sx={{
                      height: 10,
                      borderRadius: 1,
                      backgroundColor: 'background.default',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 
                          star >= 4 ? 'success.main' :
                          star === 3 ? 'info.main' :
                          star === 2 ? 'warning.main' : 'error.main'
                      }
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: '40px' }}>
                  <Typography variant="body2">
                    {metrics.ratingDistribution[5 - star]}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
        
        {/* Trend and key insights */}
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Recent Trend
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2
              }}
            >
              {metrics.recentTrend === 'improving' ? (
                <>
                  <ArrowUpwardIcon color="success" />
                  <Typography variant="body1" color="success.main" sx={{ ml: 1 }}>
                    Improving
                  </Typography>
                </>
              ) : metrics.recentTrend === 'declining' ? (
                <>
                  <ArrowDownwardIcon color="error" />
                  <Typography variant="body1" color="error.main" sx={{ ml: 1 }}>
                    Declining
                  </Typography>
                </>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                  Stable
                </Typography>
              )}
            </Box>
            
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
              Last Review
            </Typography>
            <Typography variant="body2">
              {reviews && reviews.length > 0 
                ? formatDate(reviews[0].createdAt)
                : 'No reviews yet'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Strengths and areas for improvement */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Top Strengths
          </Typography>
          <List dense>
            {metrics.topStrengths.length > 0 ? (
              metrics.topStrengths.map((strength, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <StarIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={strength.text}
                    secondary={`Category: ${strength.category} | Average: ${strength.averageScore.toFixed(1)}`}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="Not enough data to determine strengths" />
              </ListItem>
            )}
          </List>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Areas for Improvement
          </Typography>
          <List dense>
            {metrics.areasForImprovement.length > 0 ? (
              metrics.areasForImprovement.map((area, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <StarBorderIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={area.text}
                    secondary={`Category: ${area.category} | Average: ${area.averageScore.toFixed(1)}`}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="Not enough data to determine areas for improvement" />
              </ListItem>
            )}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Component for review history
const ReviewHistory = ({ reviews, subcontractorId }) => {
  const navigate = useNavigate();
  
  // Sort reviews by date (newest first)
  const sortedReviews = [...(reviews || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  const handleNewReview = () => {
    navigate(`/reviews/new/${subcontractorId}`);
  };
  
  return (
    <Box mt={4}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3" color="secondary.main">
          Review History
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleNewReview}
        >
          Add Review
        </Button>
      </Box>
      
      {sortedReviews.length === 0 ? (
        <Paper 
          sx={{ 
            p: 3, 
            textAlign: 'center',
            borderRadius: 0,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <RateReviewIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
          <Typography variant="body1" paragraph>
            No reviews have been submitted for this subcontractor yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNewReview}
          >
            Be the First to Review
          </Button>
        </Paper>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 0,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Reviewer</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedReviews.map((review) => {
                // Calculate average rating for this review
                const responses = review.responses || [];
                let avgRating = 0;
                
                if (responses.length > 0) {
                  // Only count responses with valid scores
                  const validResponses = responses.filter(r => r && typeof r.score === 'number');
                  if (validResponses.length > 0) {
                    const sum = validResponses.reduce((total, response) => total + response.score, 0);
                    avgRating = sum / validResponses.length;
                  }
                }
                
                return (
                  <TableRow key={review.id}>
                    <TableCell>
                      {formatDate(review.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 30, 
                            height: 30, 
                            mr: 1,
                            bgcolor: 'secondary.main'
                          }}
                        >
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        {review.reviewer?.username || 'Anonymous'}
                      </Box>
                    </TableCell>
                    <TableCell>{review.projectName || 'Not specified'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={avgRating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {avgRating.toFixed(1)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip 
                        title={review.comments || 'No comments provided'} 
                        arrow
                        placement="top"
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: 250,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {review.comments || 'No comments provided'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

// Main component
const SubcontractorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subcontractor, setSubcontractor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch subcontractor details
        const subResponse = await apiService.getSubcontractor(id);
        setSubcontractor(subResponse.data);
        
        // Fetch reviews for this subcontractor
        const reviewsResponse = await apiService.getReviewsBySubcontractor(id);
        setReviews(reviewsResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching subcontractor details:', err);
        setError('Failed to load subcontractor details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleNewReview = () => {
    navigate(`/reviews/new/${id}`);
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box mt={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  if (!subcontractor) {
    return (
      <Box mt={2}>
        <Alert severity="warning">Subcontractor not found</Alert>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4, 
          backgroundColor: 'secondary.main',
          color: 'white',
          position: 'relative',
          borderRadius: 0,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: '30%',
            backgroundImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))',
            zIndex: 1
          }}
        />
        
        <Grid container spacing={2} sx={{ position: 'relative', zIndex: 2 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="overline">
              Subcontractor Profile
            </Typography>
            <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
              {subcontractor.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating 
                value={subcontractor.averageRating || 0} 
                precision={0.5} 
                readOnly 
                sx={{ mr: 1 }}
              />
              <Typography variant="h6" component="span">
                {subcontractor.averageRating?.toFixed(1) || 'N/A'}
              </Typography>
              <Box 
                sx={{ 
                  ml: 2, 
                  bgcolor: 'white', 
                  color: 'secondary.main',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}
              >
                {subcontractor.letterGrade || 'N/A'}
              </Box>
              <Typography variant="body2" sx={{ ml: 1, color: 'rgba(255,255,255,0.8)' }}>
                ({subcontractor.reviewCount || 0} {subcontractor.reviewCount === 1 ? 'review' : 'reviews'})
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
              {subcontractor.description || 'No description available.'}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {Array.isArray(subcontractor.specialties) && subcontractor.specialties.map((specialty, index) => (
                <Chip 
                  key={index} 
                  label={specialty} 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }} 
                />
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ mt: { xs: 2, md: 0 } }}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mb: 2 }}
                onClick={handleNewReview}
                startIcon={<RateReviewIcon />}
              >
                Write a Review
              </Button>
              
              <List dense sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                {subcontractor.contactName && (
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36, color: 'white' }}>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={subcontractor.contactName} 
                      primaryTypographyProps={{ color: 'white' }}
                    />
                  </ListItem>
                )}
                
                {subcontractor.email && (
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36, color: 'white' }}>
                      <EmailIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={subcontractor.email} 
                      primaryTypographyProps={{ color: 'white' }}
                    />
                  </ListItem>
                )}
                
                {subcontractor.phone && (
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36, color: 'white' }}>
                      <PhoneIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={subcontractor.phone} 
                      primaryTypographyProps={{ color: 'white' }}
                    />
                  </ListItem>
                )}
                
                {subcontractor.website && (
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 36, color: 'white' }}>
                      <WebsiteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={subcontractor.website} 
                      primaryTypographyProps={{ 
                        color: 'white',
                        component: 'a',
                        href: subcontractor.website.startsWith('http') 
                          ? subcontractor.website 
                          : `https://${subcontractor.website}`,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        sx: { textDecoration: 'underline' }
                      }}
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Metrics section */}
      <MetricsSection subcontractor={subcontractor} reviews={reviews} />
      
      {/* Reviews section */}
      <ReviewHistory reviews={reviews} subcontractorId={id} />
      
      {/* Score breakdown section */}
      <ScoreBreakdown reviews={reviews} />
      
      {/* Bottom navigation */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleNewReview}
          startIcon={<RateReviewIcon />}
        >
          Write a Review
        </Button>
      </Box>
    </Container>
  );
};

export default SubcontractorDetails;