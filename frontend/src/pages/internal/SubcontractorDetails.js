import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Divider, 
  Chip, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Avatar,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Alert
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { apiService } from '../../services/api';

// Icons
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import RateReviewIcon from '@mui/icons-material/RateReview';
import WebIcon from '@mui/icons-material/Web';

// Helper function to get letter grade color
const getLetterGradeColor = (grade) => {
  switch(grade) {
    case 'A': return '#4caf50'; // Green
    case 'B': return '#8bc34a'; // Light Green
    case 'C': return '#ffeb3b'; // Yellow
    case 'D': return '#ff9800'; // Orange
    case 'F': return '#f44336'; // Red
    default: return '#757575';  // Grey
  }
};

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const SubcontractorDetails = () => {
  const { id } = useParams();
  const [subcontractor, setSubcontractor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Metrics state
  const [metrics, setMetrics] = useState({
    totalReviews: 0,
    averageRating: 0,
    recentReviews: 0, // reviews in last 30 days
    activeProjects: 0,
    specialtiesDistribution: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch subcontractor details
        const subcontractorResponse = await apiService.getSubcontractor(id);
        setSubcontractor(subcontractorResponse.data);
        
        // Fetch reviews for this subcontractor
        const reviewsResponse = await apiService.getReviewsBySubcontractor(id);
        setReviews(reviewsResponse.data);
        
        // Calculate metrics
        calculateMetrics(subcontractorResponse.data, reviewsResponse.data);
        
      } catch (err) {
        console.error('Error fetching subcontractor details:', err);
        setError('Failed to load subcontractor information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Calculate metrics from subcontractor and reviews data
  const calculateMetrics = (subData, reviewsData) => {
    if (!subData || !reviewsData) return;
    
    // Total reviews count
    const totalReviews = reviewsData.length;
    
    // Calculate average rating (we're using the averageRating from the subcontractor data)
    const averageRating = subData.averageRating || 0;
    
    // Count recent reviews (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReviews = reviewsData.filter(review => 
      new Date(review.createdAt) >= thirtyDaysAgo
    ).length;
    
    // Count active projects (simple estimate based on reviews in last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const activeProjects = reviewsData.filter(review => 
      review.projectDate && new Date(review.projectDate) >= sixMonthsAgo
    ).length;
    
    // Calculate specialties distribution
    const specialtiesDistribution = {};
    if (subData.specialties && Array.isArray(subData.specialties)) {
      subData.specialties.forEach(specialty => {
        specialtiesDistribution[specialty] = reviewsData.filter(review => 
          review.projectName && review.projectName.toLowerCase().includes(specialty.toLowerCase())
        ).length;
      });
    }
    
    setMetrics({
      totalReviews,
      averageRating,
      recentReviews,
      activeProjects,
      specialtiesDistribution
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!subcontractor) {
    return (
      <Box mt={3}>
        <Alert severity="warning">Subcontractor not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {subcontractor.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {subcontractor.description || 'No description available'}
          </Typography>
          
          {/* Specialties */}
          <Box my={2}>
            {subcontractor.specialties && subcontractor.specialties.map((specialty, index) => (
              <Chip 
                key={index} 
                label={specialty} 
                color="primary" 
                variant="outlined" 
                sx={{ mr: 1, mb: 1 }} 
              />
            ))}
          </Box>
        </Grid>
        
        {/* Letter Grade Card */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom>Overall Rating</Typography>
            <Box 
              sx={{ 
                width: 100, 
                height: 100, 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: getLetterGradeColor(subcontractor.letterGrade),
                color: 'white',
                mb: 2
              }}
            >
              <Typography variant="h2">{subcontractor.letterGrade || 'N/A'}</Typography>
            </Box>
            <Rating value={subcontractor.averageRating || 0} precision={0.5} readOnly size="large" />
            <Typography variant="body2" color="text.secondary" mt={1}>
              Based on {metrics.totalReviews} reviews
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Contact and Company Information */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <AccountCircleIcon color="primary" sx={{ mr: 2 }} />
                  <Typography>
                    <strong>Contact:</strong> {subcontractor.contactName || 'Not provided'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <EmailIcon color="primary" sx={{ mr: 2 }} />
                  <Typography>
                    <strong>Email:</strong> {subcontractor.email || 'Not provided'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <PhoneIcon color="primary" sx={{ mr: 2 }} />
                  <Typography>
                    <strong>Phone:</strong> {subcontractor.phone || 'Not provided'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <WebIcon color="primary" sx={{ mr: 2 }} />
                  <Typography>
                    <strong>Website:</strong> {
                      subcontractor.website ? (
                        <a href={subcontractor.website} target="_blank" rel="noopener noreferrer">
                          {subcontractor.website}
                        </a>
                      ) : 'Not provided'
                    }
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" alignItems="flex-start">
                  <LocationOnIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
                  <Typography>
                    <strong>Address:</strong><br />
                    {subcontractor.address || 'Not provided'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Metrics and Stats Card */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Reviews
                </Typography>
                <Typography variant="h5">
                  {metrics.totalReviews}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Recent Reviews (30 days)
                </Typography>
                <Typography variant="h5">
                  {metrics.recentReviews}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Average Rating
                </Typography>
                <Typography variant="h5">
                  {subcontractor.averageRating?.toFixed(1) || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Active Projects (6 mo.)
                </Typography>
                <Typography variant="h5">
                  {metrics.activeProjects}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" mt={2}>
                  Status
                </Typography>
                <Chip 
                  label={subcontractor.status?.toUpperCase() || 'UNKNOWN'} 
                  color={subcontractor.status === 'active' ? 'success' : 'error'} 
                  size="small"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Documents Section */}
      {subcontractor.documents && subcontractor.documents.length > 0 && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Documents
          </Typography>
          <Paper elevation={1}>
            <List>
              {subcontractor.documents.map((doc) => (
                <ListItem key={doc.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <AttachFileIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={doc.title || doc.fileName} 
                    secondary={`${doc.description || 'No description'} • ${formatDate(doc.createdAt)}`} 
                  />
                  {/* If you want to implement download functionality later */}
                  <Button size="small" color="primary">
                    Download
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}
      
      {/* Reviews Section */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Recent Reviews
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<RateReviewIcon />}
            component={RouterLink}
            to={`/review/new/${id}`}
          >
            Write a Review
          </Button>
        </Box>
        
        {reviews.length === 0 ? (
          <Alert severity="info">
            No reviews yet for this subcontractor
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {reviews.slice(0, 3).map((review) => (
              <Grid item xs={12} md={4} key={review.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Rating value={review.overallRating} readOnly precision={0.5} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(review.createdAt)}
                      </Typography>
                    </Box>
                    
                    {review.projectName && (
                      <Box display="flex" alignItems="center" mb={1}>
                        <EventIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Project: {review.projectName}
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="body2" sx={{ mb: 1, minHeight: '40px' }}>
                      {review.comments?.length > 150 
                        ? `${review.comments.substring(0, 150)}...` 
                        : review.comments || 'No comments provided'}
                    </Typography>
                    
                    {review.hasAttachments && (
                      <Chip 
                        icon={<AttachFileIcon />} 
                        label="Has attachments" 
                        size="small" 
                        variant="outlined" 
                        sx={{ mr: 1 }} 
                      />
                    )}
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">View Details</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        {reviews.length > 3 && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button color="primary">View All Reviews</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SubcontractorDetails;