/**
 * Direct server startup file for Render deployment
 * This is a minimal implementation to ensure Render detects an open port
 */

const http = require('http');

// IMPORTANT: Render expects applications to listen on port 10000
const PORT = parseInt(process.env.PORT || '10000');

console.log('========================================');
console.log('RENDER DEPLOYMENT - DIRECT PORT BINDING');
console.log('========================================');
console.log(`Starting minimal server on PORT: ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Current directory: ${process.cwd()}`);
console.log(`Process ID: ${process.pid}`);
console.log('----------------------------------------');

// Create a minimal HTTP server
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] Request: ${req.method} ${req.url}`);
  
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({
    status: 'ok',
    message: 'Render deployment health check',
    port: PORT,
    time: new Date().toISOString(),
    url: req.url,
    method: req.method
  }));
});

// Explicitly listen on 0.0.0.0 (all interfaces)
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server SUCCESSFULLY bound to port ${PORT}`);
  console.log(`Server address: ${JSON.stringify(server.address())}`);
  console.log('Server is ready to accept requests');
});

// Handle server errors
server.on('error', (error) => {
  console.error('SERVER ERROR:', error);
  console.error(`Failed to bind to port ${PORT}`);
  
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  
  // Exit with error code to trigger Render's restart mechanism
  process.exit(1);
});