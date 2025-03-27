import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, CardHeader, Divider } from '@mui/material';
import { 
  Business as BusinessIcon, 
  People as PeopleIcon, 
  RateReview as ReviewIcon, 
  StarRate as StarIcon 
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Box sx={{ mr: 2, color }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const RecentReviewsTable = () => {
  // This would be populated from an API call
  const reviews = [
    { id: 1, subcontractor: 'ABC Electrical', reviewer: 'John Smith', rating: 4, date: '2025-03-25' },
    { id: 2, subcontractor: 'XYZ Plumbing', reviewer: 'Sarah Johnson', rating: 5, date: '2025-03-24' },
    { id: 3, subcontractor: 'Acme Construction', reviewer: 'Michael Brown', rating: 3, date: '2025-03-23' }
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Recent Reviews" />
      <Divider />
      <CardContent>
        {reviews.map(review => (
          <Box key={review.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="bold">{review.subcontractor}</Typography>
              <Box display="flex" alignItems="center">
                <StarIcon sx={{ color: 'gold', mr: 0.5 }} fontSize="small" />
                <Typography variant="body2">{review.rating}/5</Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              By {review.reviewer} • {review.date}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

const TopSubcontractorsTable = () => {
  // This would be populated from an API call
  const subcontractors = [
    { id: 1, name: 'XYZ Plumbing', rating: 4.8, grade: 'A' },
    { id: 2, name: 'ABC Electrical', rating: 4.2, grade: 'B' },
    { id: 3, name: 'Acme Construction', rating: 3.5, grade: 'C' }
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Top Rated Subcontractors" />
      <Divider />
      <CardContent>
        {subcontractors.map(sub => (
          <Box key={sub.id} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" fontWeight="bold">{sub.name}</Typography>
              <Box 
                className={`letter-grade grade-${sub.grade.toLowerCase()}`} 
                sx={{ width: 30, height: 30, lineHeight: '30px' }}
              >
                {sub.grade}
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <StarIcon sx={{ color: 'gold', mr: 0.5 }} fontSize="small" />
              <Typography variant="body2">{sub.rating}/5</Typography>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  // These would be populated from API calls
  const stats = {
    subcontractors: 12,
    users: 24,
    reviews: 87,
    avgRating: 4.2
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Row */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Subcontractors" 
            value={stats.subcontractors} 
            icon={<BusinessIcon fontSize="large" />} 
            color="primary.main" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Users" 
            value={stats.users} 
            icon={<PeopleIcon fontSize="large" />} 
            color="secondary.main" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Reviews" 
            value={stats.reviews} 
            icon={<ReviewIcon fontSize="large" />} 
            color="success.main" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Avg. Rating" 
            value={stats.avgRating} 
            icon={<StarIcon fontSize="large" />} 
            color="warning.main" 
          />
        </Grid>
        
        {/* Data Row */}
        <Grid item xs={12} md={6}>
          <RecentReviewsTable />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopSubcontractorsTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;