import React from 'react';
import { Typography, Box } from '@mui/material';

const UserManagement = () => {
  return (
    <Box>
      <Typography variant="h4">
        User Management
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page will contain the list of users with management capabilities.
      </Typography>
    </Box>
  );
};

export default UserManagement;