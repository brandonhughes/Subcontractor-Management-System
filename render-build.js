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
    'build:all': 'npm run build:frontend'
  },
  dependencies: {
    'express': '^4.18.2',
    'compression': '^1.7.4',
    'cors': '^2.8.5'
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

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS
app.use(cors());

// Compress all responses
app.use(compression());

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// All requests that aren't for static files should be sent to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
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

console.log('Build preparation complete. Ready to deploy.');