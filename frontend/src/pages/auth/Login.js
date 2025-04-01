import React, { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AuthContext } from '../../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  username: Yup.string().required('Username or email is required'),
  password: Yup.string().required('Password is required')
});

export default function Login() {
  const { login, error: contextError } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember: false
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Form submission started');
      setLoading(true);
      setError(null);
      
      try {
        console.log('Attempting login with:', { username: values.username });
        const result = await login(values.username, values.password);
        console.log('Login successful, user:', result);
        // Redirect happens in App.js based on authentication state
      } catch (err) {
        console.error('Login failed:', err);
        setError(err.message || 'Failed to login. Please check your credentials.');
        // Show detailed error in console
        if (err.response) {
          console.error('Response error:', err.response.data);
          console.error('Status:', err.response.status);
        }
      } finally {
        setLoading(false);
        console.log('Form submission completed');
      }
    }
  });

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container component={Paper} elevation={3} sx={{ minHeight: '600px' }}>
        {/* Left side - Image */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            position: 'relative',
            display: { xs: 'none', md: 'block' },
            overflow: 'hidden'
          }}
        >
          <Box
            component="img"
            src="/login-image.jpg"
            alt="Construction workers"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </Grid>
        
        {/* Right side - Login Form */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          {/* Debug info - remove in production */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            API URL: {process.env.REACT_APP_API_URL}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username or Email"
            name="username"
            autoComplete="username"
            autoFocus
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <FormControlLabel
            control={
              <Checkbox 
                value="remember" 
                color="secondary" 
                name="remember"
                checked={formik.values.remember}
                onChange={formik.handleChange}
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link component={RouterLink} to="#" variant="body2" sx={{ color: 'secondary.main' }}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2" sx={{ color: 'secondary.main' }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box mt={5}>
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Subcontractor Management System'}
        </Typography>
      </Box>
    </Container>
  );
}