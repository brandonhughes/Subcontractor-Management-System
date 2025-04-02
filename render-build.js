const fs = require('fs-extra');
const { execSync } = require('child_process');
const path = require('path');

// Environment setup
process.env.NODE_ENV = 'production';
process.env.CI = 'false';

console.log('Starting Render build process...');

// Create render-build directory if it doesn't exist
const buildDir = path.join(__dirname, 'render-build');
fs.ensureDirSync(buildDir);

// Copy frontend files to build directory
console.log('Copying frontend files...');
fs.copySync(
  path.join(__dirname, 'frontend'),
  path.join(buildDir, 'frontend'),
  {
    filter: (src) => !src.includes('node_modules')
  }
);

// Copy backend files to build directory
console.log('Copying backend files...');
fs.copySync(
  path.join(__dirname, 'backend'),
  path.join(buildDir, 'backend'),
  {
    filter: (src) => !src.includes('node_modules')
  }
);

// Copy port detection scripts to build directory
console.log('Copying port detection files...');
fs.copySync(
  path.join(__dirname, 'express-detect-port.js'),
  path.join(buildDir, 'express-detect-port.js')
);
fs.copySync(
  path.join(__dirname, 'build-detect-port.js'),
  path.join(buildDir, 'build-detect-port.js')
);
fs.copySync(
  path.join(__dirname, 'render-build.sh'),
  path.join(buildDir, 'render-build.sh')
);

// Write a custom package.json for the frontend
console.log('Creating special frontend package.json...');
const frontendPackageJson = {
  name: 'subcontractor-management-system-frontend',
  version: '0.1.0',
  private: true,
  dependencies: {
    '@emotion/react': '^11.10.6',
    '@emotion/styled': '^11.10.6',
    '@mui/icons-material': '^5.11.16',
    '@mui/material': '^5.12.1',
    'axios': '^1.3.6',
    'formik': '^2.2.9',
    'react': '^18.2.0',
    'react-dom': '^18.2.0',
    'react-router-dom': '^6.10.0',
    'react-scripts': '5.0.1',
    'typescript': '4.9.5',
    'web-vitals': '^3.3.1',
    'yup': '^1.1.1',
    'serve': '^14.2.1'
  },
  scripts: {
    'start': 'react-scripts start',
    'build': 'react-scripts build',
    'test': 'react-scripts test',
    'serve': 'serve -s build'
  },
  browserslist: {
    'production': [
      '>0.2%',
      'not dead',
      'not op_mini all'
    ],
    'development': [
      'last 1 chrome version',
      'last 1 firefox version',
      'last 1 safari version'
    ]
  }
};

fs.writeFileSync(
  path.join(buildDir, 'frontend', 'package.json'),
  JSON.stringify(frontendPackageJson, null, 2)
);

// Create root package.json and startup scripts
console.log('Creating root package.json and startup scripts...');
const rootPackageJson = {
  name: 'subcontractor-management-system-deployment',
  private: true,
  scripts: {
    'start': 'node server.js',
    'port-detect': 'PORT=10000 node express-detect-port.js',
    'build:frontend': '(PORT=10000 node express-detect-port.js & sleep 5 && cd frontend && npm install --legacy-peer-deps && npm run build)',
    'build:backend': 'cd backend && npm install',
    'build:all': 'npm run build:frontend && npm run build:backend'
  },
  dependencies: {
    'express': '^4.18.2',
    'compression': '^1.7.4',
    'cors': '^2.8.5',
    'pg': '^8.10.0',
    'pg-hstore': '^2.3.4',
    'sequelize': '^6.31.0',
    'jsonwebtoken': '^9.0.0',
    'bcryptjs': '^2.4.3',
    'dotenv': '^16.0.3',
    'multer': '^1.4.5-lts.1',
    'winston': '^3.8.2',
    'express-validator': '^7.0.1',
    'http': '^0.0.1-security'
  },
  engines: {
    "node": ">=16.0.0"
  }
};

fs.writeFileSync(
  path.join(buildDir, 'package.json'),
  JSON.stringify(rootPackageJson, null, 2)
);

// Create the render-start.js script
console.log('Creating render-start.js script...');
const renderStartScript = `
// This script is a simple HTTP server that listens on the PORT environment variable
// It's a backup in case the main server script doesn't properly bind to the port

const http = require('http');
const port = process.env.PORT || 10000;

console.log('Starting simple HTTP server on port', port);

const server = http.createServer((req, res) => {
  console.log('Received request:', req.method, req.url);
  
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({
    status: 'OK',
    message: 'Render deployment port detection server',
    port: port,
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  }));
});

server.listen(port, '0.0.0.0', () => {
  console.log(\`Server listening on port \${port}\`);
  console.log(\`Server address: \${JSON.stringify(server.address())}\`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Start the main server script after a short delay
setTimeout(() => {
  console.log('Starting main server script...');
  try {
    require('./server.js');
  } catch (err) {
    console.error('Error starting main server:', err);
  }
}, 5000);
`;

fs.writeFileSync(
  path.join(buildDir, 'render-start.js'),
  renderStartScript
);

// Create the server script
const serverScript = `
const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const app = express();

// IMPORTANT: Render looks for applications listening on port 10000 by default
const PORT = process.env.PORT || 10000;

// Log startup for debugging
console.log("Starting server with PORT:", PORT);
console.log("Environment:", process.env.NODE_ENV);

// Enable CORS
app.use(cors());

// Compress all responses
app.use(compression());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create health check endpoint at root that Render can detect
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Add another health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy' });
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

try {
  // Set up backend API routes under /api
  app.use('/api', require('./backend/src/routes'));
  console.log("API routes loaded successfully");
} catch (error) {
  console.error("Error loading API routes:", error);
}

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, uploadsDir)));

// All requests that aren't for API or static files should be sent to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Create HTTP server - required for Render to detect port binding
const server = http.createServer(app);

// Start the server and bind to the correct port
server.listen(PORT, '0.0.0.0', () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log(\`API available at http://localhost:\${PORT}/api\`);
  console.log(\`Frontend available at http://localhost:\${PORT}\`);
  console.log(\`Server hostname: \${server.address().address}\`);
  console.log(\`Server port: \${server.address().port}\`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});
`;

fs.writeFileSync(
  path.join(buildDir, 'server.js'),
  serverScript
);

// Copy Procfile
fs.writeFileSync(
  path.join(buildDir, 'Procfile'),
  'web: bash startup.sh'
);

// Create startup script with execute permissions
console.log('Creating startup script...');
const startupScript = `#!/bin/bash

# Log environment details
echo "***** STARTUP SCRIPT *****"
echo "PORT: $PORT"
echo "NODE_ENV: $NODE_ENV"
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

# Start the server directly, with additional logging
echo "Starting server directly..."
node server.js
`;

fs.writeFileSync(
  path.join(buildDir, 'startup.sh'),
  startupScript
);

// Make startup script executable
try {
  fs.chmodSync(path.join(buildDir, 'startup.sh'), '755');
  console.log('Made startup script executable');
} catch (error) {
  console.error('Error making startup script executable:', error);
}

// Create a .env file with essential environment variables
console.log('Creating environment file...');
const envContent = `
NODE_ENV=production
PORT=${process.env.PORT || 10000}
DB_HOST=${process.env.DB_HOST || 'localhost'}
DB_PORT=${process.env.DB_PORT || 5432}
DB_NAME=${process.env.DB_NAME || 'subcontractor_management'}
DB_USER=${process.env.DB_USER || 'postgres'}
DB_PASSWORD=${process.env.DB_PASSWORD || 'postgres'}
JWT_SECRET=${process.env.JWT_SECRET || 'development-secret-key'}
JWT_EXPIRES_IN=${process.env.JWT_EXPIRES_IN || '1d'}
UPLOAD_DIR=${process.env.UPLOAD_DIR || 'uploads'}
MAX_FILE_SIZE=${process.env.MAX_FILE_SIZE || 5242880}
LOG_LEVEL=${process.env.LOG_LEVEL || 'info'}
`;

fs.writeFileSync(
  path.join(buildDir, '.env'),
  envContent
);

// Create an index.js file in the backend routes directory if it doesn't exist
const routesDir = path.join(buildDir, 'backend', 'src', 'routes');
fs.ensureDirSync(routesDir);

const routesIndexContent = `
const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const subcontractorRoutes = require('./subcontractor.routes');
const reviewRoutes = require('./review.routes');
const questionRoutes = require('./question.routes');

// Register routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/subcontractors', subcontractorRoutes);
router.use('/reviews', reviewRoutes);
router.use('/questions', questionRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'API is running' });
});

module.exports = router;
`;

const routesIndexPath = path.join(routesDir, 'index.js');
if (!fs.existsSync(routesIndexPath)) {
  console.log('Creating routes index file...');
  fs.writeFileSync(routesIndexPath, routesIndexContent);
}

console.log('Build preparation complete. Ready to deploy.');