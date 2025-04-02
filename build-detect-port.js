/**
 * This file creates a temporary server to keep the Render build process happy
 * Render's deployment system looks for an open port during the build process,
 * even though our React build doesn't actually require a server.
 */

const http = require('http');
const PORT = process.env.PORT || 10000;

console.log(`Starting temporary port detection server on port ${PORT}...`);

const server = http.createServer((req, res) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Temporary port detection server for Render build process',
    time: new Date().toISOString()
  }));
});

// Bind to all interfaces (0.0.0.0) to ensure Render can detect it
server.listen(PORT, '0.0.0.0', () => {
  const address = server.address();
  console.log(`Temporary port detection server running at http://${address.address}:${address.port}/`);
  console.log(`Server is bound to address: ${address.address}, port: ${address.port}`);
});

// Handle errors
server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Keep the server running for the duration of the build
console.log('Server will continue running during the build process');
console.log('React build can proceed in parallel...');