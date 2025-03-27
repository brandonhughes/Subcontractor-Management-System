import React, { useState } from 'react';
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
  Avatar
} from '@mui/material';
import { 
  Search as SearchIcon, 
  StarRate as StarIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SubcontractorCard = ({ subcontractor }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/subcontractors/${subcontractor.id}`);
  };
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div">
            {subcontractor.name}
          </Typography>
          <Box 
            className={`letter-grade grade-${subcontractor.letterGrade.toLowerCase()}`}
          >
            {subcontractor.letterGrade}
          </Box>
        </Box>
        
        <Box display="flex" alignItems="center" mb={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <StarIcon sx={{ color: 'gold', mr: 0.5 }} fontSize="small" />
            <Typography variant="body2">{subcontractor.rating}/5</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            ({subcontractor.reviewCount} reviews)
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" mb={2}>
          {subcontractor.description}
        </Typography>
        
        <Box mb={2}>
          {subcontractor.specialties.map((specialty, index) => (
            <Chip 
              key={index} 
              label={specialty} 
              size="small" 
              sx={{ mr: 0.5, mb: 0.5 }} 
            />
          ))}
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button size="small" onClick={handleViewDetails}>View Details</Button>
        <Button 
          size="small" 
          color="primary" 
          onClick={() => navigate(`/reviews/new/${subcontractor.id}`)}
        >
          Write Review
        </Button>
      </CardActions>
    </Card>
  );
};

const InternalDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // This would be populated from an API call
  const subcontractors = [
    { 
      id: 1, 
      name: 'ABC Electrical Contractors', 
      description: 'Experienced electrical contractor specializing in commercial and industrial projects.',
      specialties: ['Electrical', 'Lighting', 'Power Systems'],
      rating: 4.2,
      letterGrade: 'B',
      reviewCount: 15
    },
    { 
      id: 2, 
      name: 'XYZ Plumbing Solutions', 
      description: 'Full-service plumbing contractor with 20+ years of experience.',
      specialties: ['Plumbing', 'HVAC', 'Water Systems'],
      rating: 4.7,
      letterGrade: 'A',
      reviewCount: 23
    },
    { 
      id: 3, 
      name: 'Acme Construction', 
      description: 'Full-service construction company specializing in commercial building projects.',
      specialties: ['General Contracting', 'Carpentry', 'Concrete'],
      rating: 3.5,
      letterGrade: 'C',
      reviewCount: 12
    },
    { 
      id: 4, 
      name: 'Superior Painting Inc', 
      description: 'Professional painting contractors for commercial and residential projects.',
      specialties: ['Painting', 'Wall Coverings', 'Surface Preparation'],
      rating: 4.0,
      letterGrade: 'B',
      reviewCount: 8
    },
    { 
      id: 5, 
      name: 'Metro HVAC Services', 
      description: 'Commercial HVAC installation, maintenance, and repair services.',
      specialties: ['HVAC', 'Ventilation', 'Temperature Control'],
      rating: 3.8,
      letterGrade: 'B',
      reviewCount: 10
    },
    { 
      id: 6, 
      name: 'Elite Roofing Solutions', 
      description: 'Commercial and industrial roofing specialists.',
      specialties: ['Roofing', 'Waterproofing', 'Inspection'],
      rating: 4.5,
      letterGrade: 'A',
      reviewCount: 18
    }
  ];
  
  const filteredSubcontractors = subcontractors.filter(
    sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.specialties.some(sp => sp.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Subcontractor Directory
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Find and review subcontractors for your projects
      </Typography>
      
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
                Try adjusting your search criteria
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default InternalDashboard;