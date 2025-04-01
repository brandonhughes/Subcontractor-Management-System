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
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigate(item.path)}
            sx={{
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(225, 39, 38, 0.08)',
              },
              '&:hover .MuiListItemIcon-root': {
                color: 'primary.main',
              },
              '&:hover .MuiListItemText-primary': {
                color: 'primary.main',
                fontWeight: 600,
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: 'secondary.main',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontFamily: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            fontSize: '0.8rem',
            mb: 2
          }}
        >
          Subcontractor Management System provides tools to evaluate and manage your subcontractors.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/dashboard')}
          sx={{
            mt: 1
          }}
        >
          Return to Dashboard
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box 
              component="div" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mr: 2,
                color: 'secondary.main'
              }}
            >
              <IconButton
                size="large"
                edge="start"
                color="secondary"
                aria-label="menu"
                sx={{ mr: 1 }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ 
                  fontFamily: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: 700,
                  color: 'secondary.main', 
                  display: { xs: 'none', sm: 'block' },
                  fontSize: '1.25rem'
                }}
              >
                Subcontractor MS
              </Typography>
            </Box>
            
            {/* Red line accent */}
            <Box 
              sx={{ 
                height: '64px', 
                width: '5px', 
                bgcolor: 'primary.main',
                mr: 2,
                display: { xs: 'none', md: 'block' }
              }} 
            />

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ 
                flexGrow: 1,
                fontFamily: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              Subcontractor Management System
            </Typography>

            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant="subtitle2"
                sx={{ 
                  mr: 2, 
                  display: { xs: 'none', sm: 'block' },
                  color: 'text.secondary'
                }}
              >
                {currentUser?.username || "User"}
              </Typography>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar 
                    alt={currentUser?.username} 
                    src={currentUser?.profileImage}
                    sx={{ 
                      bgcolor: 'secondary.main',
                      width: 40,
                      height: 40
                    }}
                  >
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
                PaperProps={{
                  elevation: 2,
                  sx: { borderRadius: 0 }
                }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                  </ListItemIcon>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
        {/* Red accent line at bottom of AppBar */}
        <Box sx={{ height: '5px', width: '100%', bgcolor: 'primary.main' }} />
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 250,
            marginTop: '69px', // AppBar height + accent line
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'background.default',
            boxShadow: '4px 0 10px rgba(0,0,0,0.05)'
          }
        }}
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: '100%',
          marginTop: '69px', // AppBar height + accent line
          bgcolor: 'background.default'
        }}
      >
        <Outlet />
      </Box>
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto',
          backgroundColor: 'secondary.main',
          color: 'white'
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' Subcontractor Management System'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;