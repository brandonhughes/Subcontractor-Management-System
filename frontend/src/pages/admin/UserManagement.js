import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  TextField, FormControl, InputLabel, Select, MenuItem, Chip, CircularProgress, TablePagination,
  Snackbar, Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api, { apiService } from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'internal',
    department: '',
    status: 'active',
    changePassword: false
  });
  
  // Selected user for edit/delete/reset
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Snackbar notification
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
      showSnackbar('Failed to fetch users', 'error');
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

  // Reset form data
  const resetFormData = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: 'internal',
      department: '',
      status: 'active',
      changePassword: false
    });
  };

  // Open add user dialog
  const handleOpenAddDialog = () => {
    resetFormData();
    setOpenAddDialog(true);
  };

  // Close add user dialog
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  // Open edit user dialog
  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role,
      department: user.department || '',
      status: user.status,
      password: '',
      confirmPassword: '',
      changePassword: false
    });
    setOpenEditDialog(true);
  };

  // Close edit user dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  // Open delete user dialog
  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  // Close delete user dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Reset password functionality moved to Edit User dialog

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

  // Create new user
  const handleCreateUser = async () => {
    // Validate form
    if (!formData.username || !formData.email || !formData.password) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showSnackbar('Passwords do not match', 'error');
      return;
    }

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        department: formData.department,
        status: formData.status
      };

      const response = await apiService.createUser(userData);
      showSnackbar('User created successfully');
      fetchUsers();
      handleCloseAddDialog();
    } catch (err) {
      console.error('Error creating user:', err);
      showSnackbar(err.response?.data?.message || 'Failed to create user', 'error');
    }
  };

  // Update existing user
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    // Validate password if changing it
    if (formData.changePassword) {
      if (!formData.password) {
        showSnackbar('Password is required', 'error');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        showSnackbar('Passwords do not match', 'error');
        return;
      }
    }

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        department: formData.department,
        status: formData.status
      };

      // If changing password, add it to the update data
      if (formData.changePassword && formData.password) {
        userData.password = formData.password;
      }

      const response = await apiService.updateUser(selectedUser.id, userData);
      showSnackbar('User updated successfully');
      fetchUsers();
      handleCloseEditDialog();
    } catch (err) {
      console.error('Error updating user:', err);
      showSnackbar(err.response?.data?.message || 'Failed to update user', 'error');
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await apiService.deleteUser(selectedUser.id);
      showSnackbar('User deleted successfully');
      fetchUsers();
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting user:', err);
      showSnackbar(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  // Password reset functionality integrated into handleUpdateUser

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

  // Display name from first and last name
  const getDisplayName = (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else {
      return 'N/A';
    }
  };

  // Get role display name
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'internal':
        return 'Internal User';
      default:
        return role;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={fetchUsers}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenAddDialog}
          >
            Add User
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
            <Table stickyHeader aria-label="users table">
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{getDisplayName(user)}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleDisplay(user.role)}</TableCell>
                      <TableCell>{user.department || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status} 
                          color={getStatusColor(user.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpenEditDialog(user)}
                          title="Edit User"
                        >
                          <EditIcon />
                        </IconButton>
                        {/* Removed separate password reset button since it's now in the edit dialog */}
                        <IconButton 
                          color="error" 
                          onClick={() => handleOpenDeleteDialog(user)}
                          title="Delete User"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1" sx={{ py: 2 }}>
                        No users found
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
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              name="username"
              label="Username"
              fullWidth
              value={formData.username}
              onChange={handleInputChange}
            />
            <TextField
              required
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Box>
            <TextField
              name="department"
              label="Department"
              fullWidth
              value={formData.department}
              onChange={handleInputChange}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleInputChange}
              >
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="internal">Internal User</MenuItem>
              </Select>
            </FormControl>
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
            <TextField
              required
              name="password"
              label="Password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleInputChange}
            />
            <TextField
              required
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
              helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Passwords do not match' : ''}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained">Create User</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              name="username"
              label="Username"
              fullWidth
              value={formData.username}
              onChange={handleInputChange}
            />
            <TextField
              required
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Box>
            <TextField
              name="department"
              label="Department"
              fullWidth
              value={formData.department}
              onChange={handleInputChange}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleInputChange}
              >
                <MenuItem value="admin">Administrator</MenuItem>
                <MenuItem value="internal">Internal User</MenuItem>
              </Select>
            </FormControl>
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
            
            {/* Password change option */}
            <FormControlLabel
              control={
                <Checkbox
                  name="changePassword"
                  checked={formData.changePassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      changePassword: e.target.checked,
                      password: '',
                      confirmPassword: ''
                    });
                  }}
                />
              }
              label="Change Password"
            />
            
            {formData.changePassword && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  name="password"
                  label="New Password"
                  type="password"
                  fullWidth
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                  helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Passwords do not match' : ''}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained">Update User</Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user "{selectedUser?.username}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog removed - functionality integrated into Edit User Dialog */}

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

export default UserManagement;