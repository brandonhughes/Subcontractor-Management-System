import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, FormControl, InputLabel, Select, MenuItem, Chip, CircularProgress, TablePagination,
  Snackbar, Alert, Grid, Stack, FormGroup, FormControlLabel, Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

import { apiService } from '../../services/api';

// List of common construction specialties
const CONSTRUCTION_SPECIALTIES = [
  'General Contracting',
  'Electrical',
  'Plumbing',
  'HVAC',
  'Roofing',
  'Concrete',
  'Masonry',
  'Carpentry',
  'Drywall',
  'Painting',
  'Flooring',
  'Landscaping',
  'Excavation',
  'Demolition',
  'Steel Work',
  'Glass/Glazing',
  'Insulation',
  'Fire Protection',
  'Asphalt/Paving',
  'Security Systems'
];

const SubcontractorList = () => {
  const [subcontractors, setSubcontractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    specialties: [],
    description: '',
    website: '',
    status: 'active'
  });
  
  // Selected subcontractor for edit/delete
  const [selectedSubcontractor, setSelectedSubcontractor] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Snackbar notification
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch subcontractors on component mount
  useEffect(() => {
    fetchSubcontractors();
  }, []);

  // Fetch subcontractors from API
  const fetchSubcontractors = async () => {
    setLoading(true);
    try {
      const response = await apiService.getSubcontractors();
      setSubcontractors(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching subcontractors:', err);
      setError('Failed to fetch subcontractors. Please try again.');
      showSnackbar('Failed to fetch subcontractors', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle specialty checkbox changes
  const handleSpecialtyChange = (specialty) => {
    const currentSpecialties = [...formData.specialties];
    const specialtyIndex = currentSpecialties.indexOf(specialty);
    
    if (specialtyIndex === -1) {
      // Add specialty if not already selected
      currentSpecialties.push(specialty);
    } else {
      // Remove specialty if already selected
      currentSpecialties.splice(specialtyIndex, 1);
    }
    
    setFormData({
      ...formData,
      specialties: currentSpecialties
    });
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      specialties: [],
      description: '',
      website: '',
      status: 'active'
    });
  };

  // Open add subcontractor dialog
  const handleOpenAddDialog = () => {
    resetFormData();
    setOpenAddDialog(true);
  };

  // Close add subcontractor dialog
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  // Open edit subcontractor dialog
  const handleOpenEditDialog = (subcontractor) => {
    setSelectedSubcontractor(subcontractor);
    setFormData({
      name: subcontractor.name,
      contactName: subcontractor.contactName || '',
      email: subcontractor.email || '',
      phone: subcontractor.phone || '',
      address: subcontractor.address || '',
      specialties: Array.isArray(subcontractor.specialties) ? subcontractor.specialties : [],
      description: subcontractor.description || '',
      website: subcontractor.website || '',
      status: subcontractor.status
    });
    setOpenEditDialog(true);
  };

  // Close edit subcontractor dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  // Open delete subcontractor dialog
  const handleOpenDeleteDialog = (subcontractor) => {
    setSelectedSubcontractor(subcontractor);
    setOpenDeleteDialog(true);
  };

  // Close delete subcontractor dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Create new subcontractor
  const handleCreateSubcontractor = async () => {
    // Validate form
    if (!formData.name) {
      showSnackbar('Company name is required', 'error');
      return;
    }

    try {
      const subcontractorData = {
        name: formData.name,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        specialties: formData.specialties,
        description: formData.description,
        website: formData.website,
        status: formData.status
      };

      await apiService.createSubcontractor(subcontractorData);
      showSnackbar('Subcontractor created successfully');
      fetchSubcontractors();
      handleCloseAddDialog();
    } catch (err) {
      console.error('Error creating subcontractor:', err);
      showSnackbar(err.response?.data?.message || 'Failed to create subcontractor', 'error');
    }
  };

  // Update existing subcontractor
  const handleUpdateSubcontractor = async () => {
    if (!selectedSubcontractor) return;

    // Validate form
    if (!formData.name) {
      showSnackbar('Company name is required', 'error');
      return;
    }

    try {
      const subcontractorData = {
        name: formData.name,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        specialties: formData.specialties,
        description: formData.description,
        website: formData.website,
        status: formData.status
      };

      await apiService.updateSubcontractor(selectedSubcontractor.id, subcontractorData);
      showSnackbar('Subcontractor updated successfully');
      fetchSubcontractors();
      handleCloseEditDialog();
    } catch (err) {
      console.error('Error updating subcontractor:', err);
      showSnackbar(err.response?.data?.message || 'Failed to update subcontractor', 'error');
    }
  };

  // Delete subcontractor
  const handleDeleteSubcontractor = async () => {
    if (!selectedSubcontractor) return;

    try {
      await apiService.deleteSubcontractor(selectedSubcontractor.id);
      showSnackbar('Subcontractor deleted successfully');
      fetchSubcontractors();
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting subcontractor:', err);
      showSnackbar(err.response?.data?.message || 'Failed to delete subcontractor', 'error');
    }
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  // Format specialties as a string
  const formatSpecialties = (specialties) => {
    if (!specialties || !Array.isArray(specialties) || specialties.length === 0) {
      return 'N/A';
    }
    return specialties.join(', ');
  };

  // Get letter grade color
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':
        return '#4CAF50'; // Green
      case 'B':
        return '#8BC34A'; // Light Green
      case 'C':
        return '#FFEB3B'; // Yellow
      case 'D':
        return '#FF9800'; // Orange
      case 'F':
        return '#F44336'; // Red
      default:
        return '#9E9E9E'; // Grey
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Subcontractor Management</Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={fetchSubcontractors}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenAddDialog}
          >
            Add Subcontractor
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader aria-label="subcontractors table">
              <TableHead>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Specialties</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subcontractors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((subcontractor) => (
                    <TableRow key={subcontractor.id} hover>
                      <TableCell>{subcontractor.name}</TableCell>
                      <TableCell>{subcontractor.contactName || 'N/A'}</TableCell>
                      <TableCell>{subcontractor.email || 'N/A'}</TableCell>
                      <TableCell>{subcontractor.phone || 'N/A'}</TableCell>
                      <TableCell>{formatSpecialties(subcontractor.specialties)}</TableCell>
                      <TableCell>
                        <Box 
                          sx={{ 
                            backgroundColor: getGradeColor(subcontractor.letterGrade),
                            color: 'white',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.5rem'
                          }}
                        >
                          {subcontractor.letterGrade || 'C'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={subcontractor.status} 
                          color={getStatusColor(subcontractor.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpenEditDialog(subcontractor)}
                          title="Edit Subcontractor"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleOpenDeleteDialog(subcontractor)}
                          title="Delete Subcontractor"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                ))}
                {subcontractors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body1" sx={{ py: 2 }}>
                        No subcontractors found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={subcontractors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Add Subcontractor Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add New Subcontractor</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  name="name"
                  label="Company Name"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="contactName"
                  label="Contact Name"
                  fullWidth
                  value={formData.contactName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="phone"
                  label="Phone"
                  fullWidth
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="website"
                  label="Website"
                  fullWidth
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Address"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Specialties</Typography>
                <FormGroup>
                  <Grid container spacing={2}>
                    {CONSTRUCTION_SPECIALTIES.map((specialty) => (
                      <Grid item xs={12} sm={6} md={4} key={specialty}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.specialties.includes(specialty)}
                              onChange={() => handleSpecialtyChange(specialty)}
                              name={`specialty-${specialty}`}
                            />
                          }
                          label={specialty}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleCreateSubcontractor} variant="contained">Create Subcontractor</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subcontractor Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Subcontractor</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  name="name"
                  label="Company Name"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="contactName"
                  label="Contact Name"
                  fullWidth
                  value={formData.contactName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="phone"
                  label="Phone"
                  fullWidth
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="website"
                  label="Website"
                  fullWidth
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Address"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Specialties</Typography>
                <FormGroup>
                  <Grid container spacing={2}>
                    {CONSTRUCTION_SPECIALTIES.map((specialty) => (
                      <Grid item xs={12} sm={6} md={4} key={specialty}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.specialties.includes(specialty)}
                              onChange={() => handleSpecialtyChange(specialty)}
                              name={`specialty-${specialty}`}
                            />
                          }
                          label={specialty}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateSubcontractor} variant="contained">Update Subcontractor</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Subcontractor Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete subcontractor "{selectedSubcontractor?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteSubcontractor} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SubcontractorList;