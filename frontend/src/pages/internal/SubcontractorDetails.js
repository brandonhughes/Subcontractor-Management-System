import React from 'react';
import { Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const SubcontractorDetails = () => {
  const { id } = useParams();

  return (
    <Box>
      <Typography variant="h4">
        Subcontractor Details
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page will display detailed information about the subcontractor with ID: {id}, including reviews and ratings.
      </Typography>
    </Box>
  );
};

export default SubcontractorDetails;