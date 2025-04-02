import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Box, 
  Typography, 
  Rating, 
  Divider, 
  Chip 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SubcontractorCard = ({ subcontractor }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/subcontractors/${subcontractor.id}`);
  };

  const handleWriteReview = () => {
    navigate(`/reviews/new/${subcontractor.id}`);
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
  
  console.log(`Subcontractor card for ${subcontractor.name}:`, {
    averageRating: subcontractor.averageRating,
    reviewCount: subcontractor.reviewCount,
    letterGrade: subcontractor.letterGrade
  });
  
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
                width: 50, 
                height: 50, 
                borderRadius: '50%', 
                backgroundColor: getLetterGradeColor(subcontractor.letterGrade),
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.5rem'
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

export default SubcontractorCard;