import React, { useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  RateReview as ReviewIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const Layout = () => {
  const { currentUser, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleCloseUserMenu();
  };

  const handleProfileClick = () => {
    // Navigate to profile page (to be implemented)
    handleCloseUserMenu();
  };

  const adminMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Subcontractors', icon: <BusinessIcon />, path: '/admin/subcontractors' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Questionnaire', icon: <ReviewIcon />, path: '/admin/questionnaire' }
  ];

  const internalMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Subcontractors', icon: <BusinessIcon />, path: '/dashboard' }
  ];

  const menuItems = isAdmin ? adminMenuItems : internalMenuItems;

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div">
          Subcontractor MS
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Subcontractor Management System
            </Typography>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={currentUser?.username} src={currentUser?.profileImage}>
                    {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          marginTop: '64px'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;