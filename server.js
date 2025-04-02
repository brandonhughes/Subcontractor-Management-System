/**
 * Production server for Subcontractor Management System
 * Serves both the backend API and frontend static files
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const http = require('http');

// Create Express app
const app = express();
const port = process.env.PORT || 10000;

// Log startup for monitoring
console.log(`
=========================================
SUBCONTRACTOR MANAGEMENT SYSTEM
Production Server Starting
=========================================
Date: ${new Date().toISOString()}
Port: ${port}
Environment: ${process.env.NODE_ENV || 'development'}
Node version: ${process.version}
Working directory: ${process.cwd()}
=========================================
`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory: ${uploadsDir}`);
}

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Subcontractor Management System is running',
    port: port,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Check for backend routes
const backendRoutesPath = path.join(__dirname, 'backend', 'src', 'routes');
if (fs.existsSync(backendRoutesPath)) {
  try {
    // Set up backend API routes
    console.log('Initializing backend API routes...');
    
    // Try to load each route file
    const authRoutes = require('./backend/src/routes/auth.routes');
    const userRoutes = require('./backend/src/routes/user.routes');
    const subcontractorRoutes = require('./backend/src/routes/subcontractor.routes');
    const reviewRoutes = require('./backend/src/routes/review.routes');
    const questionRoutes = require('./backend/src/routes/question.routes');
    
    // Apply routes with /api prefix
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/subcontractors', subcontractorRoutes);
    app.use('/api/reviews', reviewRoutes);
    app.use('/api/questions', questionRoutes);
    
    console.log('Backend API routes initialized successfully');
  } catch (error) {
    console.error('Error loading backend routes:', error);
  }
} else {
  console.warn('Backend routes directory not found at:', backendRoutesPath);
}

// Check for frontend build
const frontendBuildPath = path.join(__dirname, 'frontend', 'build');
if (fs.existsSync(frontendBuildPath)) {
  console.log('Serving frontend static files from:', frontendBuildPath);
  
  // Serve static files from frontend build
  app.use(express.static(frontendBuildPath));
  
  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, uploadsDir)));
  
  // All other routes go to index.html for client-side routing
  app.get('*', (req, res) => {
    // Skip API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    }
  });
} else {
  console.warn('Frontend build directory not found at:', frontendBuildPath);
  
  // Fallback route if no frontend build exists
  app.get('/', (req, res) => {
    res.json({
      status: 'warning',
      message: 'Subcontractor Management System API is running, but frontend is not built',
      port: port,
      timestamp: new Date().toISOString()
    });
  });
}

// Create HTTP server for better error handling
const server = http.createServer(app);

// Start server on all interfaces
server.listen(port, '0.0.0.0', () => {
  const serverInfo = server.address();
  console.log(`
SERVER STARTED SUCCESSFULLY
---------------------------
Listening on: ${serverInfo.address}:${serverInfo.port}
URL: http://localhost:${serverInfo.port}/
API URL: http://localhost:${serverInfo.port}/api
Health check: http://localhost:${serverInfo.port}/health
---------------------------
  `);
});

// Error handling
server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please use a different port.`);
    process.exit(1);
  }
});