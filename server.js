/**
 * Direct server startup file for Render deployment
 * This file starts a simple HTTP server on the port Render expects
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Explicitly use port 10000 which is what Render expects
const PORT = process.env.PORT || 10000;

console.log('====== RENDER DEPLOYMENT SERVER ======');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', PORT);
console.log('Current directory:', process.cwd());

// Create a basic server that responds to health checks
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  // Health check endpoint
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    return res.end(JSON.stringify({
      status: 'ok',
      message: 'Server is healthy',
      port: PORT,
      time: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }));
  }
  
  // For all other paths, try to use the render-build directory
  try {
    const renderBuildDir = path.join(__dirname, 'render-build');
    
    if (fs.existsSync(renderBuildDir)) {
      console.log('Render build directory exists, forwarding request');
      // Try to require the render-build server
      const renderServer = require('./render-build/server');
    } else {
      console.log('Render build directory not found, returning 404');
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: 'Not found'}));
    }
  } catch (error) {
    console.error('Error serving request:', error);
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({error: 'Internal server error', details: error.message}));
  }
});

// Explicitly bind to all interfaces (0.0.0.0)
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server address: ${JSON.stringify(server.address())}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});