import React from 'react';
import { Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const SubcontractorForm = () => {
  const { id } = useParams();
  const isNewSubcontractor = !id;

  return (
    <Box>
      <Typography variant="h4">
        {isNewSubcontractor ? 'Add New Subcontractor' : 'Edit Subcontractor'}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page will contain the form to {isNewSubcontractor ? 'create' : 'edit'} a subcontractor.
      </Typography>
    </Box>
  );
};

export default SubcontractorForm;