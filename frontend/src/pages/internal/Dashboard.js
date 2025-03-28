import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  TextField,
  InputAdornment,
  Divider,
  Avatar,
  Rating,
  CircularProgress,
  Alert,
  Fab
} from '@mui/material';
import { 
  Search as SearchIcon, 
  StarRate as StarIcon,
  Business as BusinessIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const SubcontractorCard = ({ subcontractor }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/internal/subcontractors/${subcontractor.id}`);
  };

  const handleWriteReview = () => {
    navigate(`/internal/reviews/new/${subcontractor.id}`);
  }
  
  // Get color for letter grade
  const getLetterGradeColor = (grade) => {
    switch (grade) {
      case 'A': return '#4CAF50'; // Green
      case 'B': return '#8BC34A'; // Light Green
      case 'C': return '#FFEB3B'; // Yellow
      case 'D': return '#FF9800'; // Orange
      case 'F': return '#F44336'; // Red
      default: return '#9E9E9E'; // Grey
    }
  };
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div">
            {subcontractor.name}
          </Typography>
          {subcontractor.letterGrade && (
            <Box 
              sx={{ 
                width: 36, 
                height: 36, 
                borderRadius: '50%', 
                backgroundColor: getLetterGradeColor(subcontractor.letterGrade),
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
            >
              {subcontractor.letterGrade}
            </Box>
          )}
        </Box>
        
        <Box display="flex" alignItems="center" mb={2}>
          {subcontractor.averageRating > 0 && (
            <>
              <Rating 
                value={subcontractor.averageRating} 
                precision={0.5} 
                size="small"
                readOnly
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                ({subcontractor.reviewCount || 0} reviews)
              </Typography>
            </>
          )}
          {!subcontractor.averageRating && (
            <Typography variant="body2" color="text.secondary">
              No reviews yet
            </Typography>
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" mb={2}>
          {subcontractor.description || 'No description available'}
        </Typography>
        
        <Box mb={2}>
          {Array.isArray(subcontractor.specialties) && subcontractor.specialties.map((specialty, index) => (
            <Chip 
              key={index} 
              label={specialty} 
              size="small" 
              sx={{ mr: 0.5, mb: 0.5 }} 
            />
          ))}
          {(!subcontractor.specialties || !subcontractor.specialties.length) && (
            <Typography variant="body2" color="text.secondary">
              No specialties listed
            </Typography>
          )}
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button size="small" onClick={handleViewDetails}>View Details</Button>
        <Button 
          size="small" 
          color="primary" 
          onClick={handleWriteReview}
        >
          Write Review
        </Button>
      </CardActions>
    </Card>
  );
};

const InternalDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [subcontractors, setSubcontractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch subcontractors from API
  useEffect(() => {
    const fetchSubcontractors = async () => {
      setLoading(true);
      try {
        const response = await apiService.getSubcontractors();
        setSubcontractors(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching subcontractors:', err);
        setError('Failed to load subcontractors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubcontractors();
  }, []);
  
  // Handle creating a new review
  const handleCreateReview = () => {
    navigate('/internal/reviews/new');
  };
  
  // Filter subcontractors based on search term
  const filteredSubcontractors = subcontractors.filter(
    sub => sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(sub.specialties) && sub.specialties.some(sp => sp.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <div>
          <Typography variant="h4">
            Subcontractor Directory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find and review subcontractors for your projects
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateReview}
        >
          Create a Review
        </Button>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search by name or specialty..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredSubcontractors.map(subcontractor => (
            <Grid item key={subcontractor.id} xs={12} sm={6} md={4}>
              <SubcontractorCard subcontractor={subcontractor} />
            </Grid>
          ))}
          
          {filteredSubcontractors.length === 0 && (
            <Grid item xs={12}>
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                py={5}
              >
                <Avatar sx={{ mb: 2, width: 60, height: 60, bgcolor: 'grey.200' }}>
                  <BusinessIcon sx={{ fontSize: 40, color: 'grey.500' }} />
                </Avatar>
                <Typography variant="h6" color="text.secondary">
                  No subcontractors found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No subcontractors have been added yet'}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
      
      {/* Floating action button for smaller screens */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, display: { sm: 'none' } }}>
        <Fab color="primary" aria-label="create review" onClick={handleCreateReview}>
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default InternalDashboard;