/**
 * Ultra-simple Express server for port detection
 * Will start the real server after Render picks up the port
 */

const express = require('express');
const { spawn } = require('child_process');
const app = express();
const PORT = process.env.PORT || 10000;

console.log(`Starting simple Express server for Render port detection on port ${PORT}`);

// Basic health route
app.get('/', (req, res) => {
  res.json({
    status: 'starting',
    message: 'Subcontractor Management System is starting...',
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server listening on port ${PORT}`);
  
  // Wait a bit for Render to notice our port is open
  setTimeout(() => {
    console.log('Starting the real application server...');
    
    // Start the real server
    const realServer = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: PORT },
      stdio: 'inherit'
    });
    
    realServer.on('error', (err) => {
      console.error('Failed to start real server:', err);
    });
    
    // When real server is ready, close this one
    setTimeout(() => {
      console.log('Closing temporary server...');
      server.close(() => {
        console.log('Temporary server closed');
      });
    }, 5000);
  }, 10000);
});

// Handle errors
server.on('error', (err) => {
  console.error('Simple server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Starting real server directly...`);
    // Try to start the real server directly
    const realServer = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: PORT },
      stdio: 'inherit'
    });
  }
});