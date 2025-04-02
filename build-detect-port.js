/**
 * This file creates a temporary server to keep the Render build process happy
 * Render's deployment system looks for an open port during the build process,
 * even though our React build doesn't actually require a server.
 */

const http = require('http');
const PORT = process.env.PORT || 10000;

console.log(`
==============================================
PORT DETECTION SERVER FOR RENDER BUILD PROCESS
==============================================
Environment: ${process.env.NODE_ENV || 'development'}
Port: ${PORT}
Date: ${new Date().toISOString()}
Node version: ${process.version}
Platform: ${process.platform} ${process.arch}
Working directory: ${process.cwd()}
==============================================
`);

// Exit handler to cleanly shut down
process.on('SIGINT', function() {
  console.log('Received SIGINT - shutting down port detection server');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', function() {
  console.log('Received SIGTERM - shutting down port detection server');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Create the server
const server = http.createServer((req, res) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Temporary port detection server for Render build process',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    node_version: process.version,
    uptime: process.uptime()
  }));
});

// Ensure IPv4 binding for maximum compatibility
server.listen(PORT, '0.0.0.0', () => {
  const address = server.address();
  
  console.log(`
SERVER STARTED SUCCESSFULLY
--------------------------
Listening on: ${address.address}:${address.port}
Family: ${address.family}
URL: http://localhost:${address.port}/
--------------------------
  `);
  
  // Print network interfaces to help with debugging
  try {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    
    console.log('NETWORK INTERFACES:');
    Object.keys(networkInterfaces).forEach((interfaceName) => {
      networkInterfaces[interfaceName].forEach((interfaceInfo) => {
        if (interfaceInfo.family === 'IPv4') {
          console.log(`${interfaceName}: ${interfaceInfo.address}`);
        }
      });
    });
  } catch (error) {
    console.error('Error getting network interfaces:', error.message);
  }
});

// Enhanced error handling
server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use - perhaps another instance is running?`);
    console.error('Attempting to bind to a random port instead...');
    
    // Try on a random port as a fallback
    server.listen(0, '0.0.0.0', () => {
      const address = server.address();
      console.log(`SERVER RECOVERED - now listening on random port ${address.port}`);
    });
  } else if (err.code === 'EACCES') {
    console.error(`Permission denied to bind to port ${PORT}. Try a port number > 1024.`);
    process.exit(1);
  } else {
    console.error('Unknown server error:', err);
    process.exit(1);
  }
});

// Log that we're ready for the build process
console.log('PORT DETECTION SERVER READY - RENDER BUILD CAN PROCEED');
console.log('This server will remain active during the entire build process.');