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
    'build:frontend': 'cd frontend && npm install --legacy-peer-deps && npm run build',
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
    'express-validator': '^7.0.1'
  }
};

fs.writeFileSync(
  path.join(buildDir, 'package.json'),
  JSON.stringify(rootPackageJson, null, 2)
);

// Create the server script
const serverScript = `
const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS
app.use(cors());

// Compress all responses
app.use(compression());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up backend API routes under /api
app.use('/api', require('./backend/src/routes'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, uploadsDir)));

// All requests that aren't for API or static files should be sent to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
  console.log(\`API available at http://localhost:\${PORT}/api\`);
  console.log(\`Frontend available at http://localhost:\${PORT}\`);
});
`;

fs.writeFileSync(
  path.join(buildDir, 'server.js'),
  serverScript
);

// Copy Procfile
fs.writeFileSync(
  path.join(buildDir, 'Procfile'),
  'web: npm start'
);

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