import React, { useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  Divider,
  useTheme,
  useMediaQuery,
  Badge,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  RateReview as ReviewIcon,
  Engineering as EngineeringIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Construction as ConstructionIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const Layout = () => {
  const { currentUser, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [notificationCount, setNotificationCount] = useState(3); // Example notification count

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
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
  
  const handleMenuItemClick = (path) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
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
    <Box sx={{ width: 280 }} role="presentation">
      <Box 
        sx={{ 
          p: 3, 
          bgcolor: theme.palette.primary.main,
          color: 'white',
          display: 'flex', 
          alignItems: 'center'
        }}
      >
        <ConstructionIcon sx={{ mr: 1.5, fontSize: '2rem' }} />
        <Typography variant="h6" fontWeight="bold" noWrap component="div">
          Subcontractor MS
        </Typography>
      </Box>
      <Divider />
      
      {/* User Info in Drawer */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar 
          sx={{ width: 42, height: 42, bgcolor: theme.palette.secondary.main }}
          alt={currentUser?.username} 
          src={currentUser?.profileImage}
        >
          {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
        </Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {`${currentUser?.firstName || ''} ${currentUser?.lastName || currentUser?.username || 'User'}`}
          </Typography>
          <Chip
            size="small"
            label={isAdmin ? "Administrator" : "Internal User"}
            color={isAdmin ? "secondary" : "default"}
            sx={{ 
              height: 22,
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          />
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding
            onClick={() => handleMenuItemClick(item.path)}
            sx={{
              mb: 0.5,
              mx: 1,
              borderRadius: 1,
              bgcolor: currentPath.includes(item.path) ? 
                theme.palette.primary.light + '20' : 'transparent',
              color: currentPath.includes(item.path) ? 
                theme.palette.primary.main : theme.palette.text.primary,
              '&:hover': {
                bgcolor: theme.palette.primary.light + '10',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: currentPath.includes(item.path) ? 
                  theme.palette.primary.main : undefined,
                minWidth: 45 
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: currentPath.includes(item.path) ? 600 : 400 
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button 
          fullWidth 
          variant="outlined" 
          color="primary" 
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New review submitted', message: 'A new review was submitted for ABC Electrical', time: '2 hours ago', read: false },
    { id: 2, title: 'Subcontractor updated', message: 'XYZ Plumbing updated their information', time: '1 day ago', read: false },
    { id: 3, title: 'New document uploaded', message: 'A new certification was uploaded', time: '3 days ago', read: false }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <AppBar 
        position="fixed"
        sx={{
          backgroundColor: 'white',
          color: theme.palette.text.primary,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Menu Toggle and Logo */}
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ConstructionIcon 
                color="primary" 
                sx={{ 
                  display: { xs: 'none', sm: 'flex' }, 
                  mr: 1, 
                  fontSize: '1.8rem' 
                }} 
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                color="primary"
                fontWeight="bold"
                sx={{ mr: 2 }}
              >
                Subcontractor MS
              </Typography>
            </Box>
            
            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 3 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  sx={{ 
                    mx: 0.5, 
                    py: 1,
                    color: currentPath.includes(item.path) ? 
                      theme.palette.primary.main : theme.palette.text.primary,
                    borderBottom: currentPath.includes(item.path) ? 
                      `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                    borderRadius: 0,
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: theme.palette.primary.main,
                    }
                  }}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Notifications */}
            <Box sx={{ mr: 2 }}>
              <Tooltip title="Notifications">
                <IconButton
                  onClick={handleOpenNotifications}
                  size="large"
                  color="inherit"
                  aria-label="show notifications"
                >
                  <Badge badgeContent={notificationCount} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-notifications"
                anchorEl={anchorElNotifications}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNotifications)}
                onClose={handleCloseNotifications}
                PaperProps={{
                  sx: { width: 320, maxHeight: 400 }
                }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
                </Box>
                {notifications.map((notification) => (
                  <MenuItem 
                    key={notification.id} 
                    onClick={handleCloseNotifications}
                    sx={{ 
                      py: 1.5,
                      borderLeft: notification.read ? 'none' : `4px solid ${theme.palette.secondary.main}`
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight={notification.read ? 400 : 600}>
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {notification.time}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
                <Box sx={{ p: 1, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
                  <Button
                    size="small"
                    onClick={handleCloseNotifications}
                  >
                    View All
                  </Button>
                </Box>
              </Menu>
            </Box>

            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Account settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar 
                    alt={currentUser?.username} 
                    src={currentUser?.profileImage}
                    sx={{ 
                      width: 36, 
                      height: 36,
                      bgcolor: theme.palette.secondary.main
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
              >
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography>My Profile</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Side Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        variant={isMobile ? "temporary" : "temporary"}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: '100%',
          marginTop: '64px',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;