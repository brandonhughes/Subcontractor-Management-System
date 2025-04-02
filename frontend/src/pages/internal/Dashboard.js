import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  TextField,
  InputAdornment,
  Avatar,
  CircularProgress,
  Alert,
  Fab,
  Button
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Business as BusinessIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import SubcontractorCard from './SubcontractorCard';

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
        console.log('Dashboard - subcontractors data:', response.data);
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
    navigate('/reviews/new');
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