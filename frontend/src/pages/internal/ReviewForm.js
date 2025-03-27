import React from 'react';
import { Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const ReviewForm = () => {
  const { subcontractorId, reviewId } = useParams();
  const isNewReview = !reviewId;

  return (
    <Box>
      <Typography variant="h4">
        {isNewReview ? 'Write Review' : 'Edit Review'}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page will contain the form to {isNewReview ? 'submit a new' : 'edit an existing'} review 
        {isNewReview ? ` for subcontractor with ID: ${subcontractorId}` : ` with ID: ${reviewId}`}.
      </Typography>
    </Box>
  );
};

export default ReviewForm;