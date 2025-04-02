/**
 * Simpler Express server for port detection during Render build
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// Log startup
console.log(`Starting Express port detection server on port ${PORT}`);

// Basic health route
app.get('/', (req, res) => {
  console.log('Health check request received');
  res.json({
    status: 'ok',
    message: 'Express port detection server running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Start server with explicit binding to all interfaces
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express port detection server listening on port ${PORT}`);
  console.log(`Server address: ${JSON.stringify(server.address())}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Express server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Trying to use a different port...`);
    // Try again with a random port
    server.listen(0, '0.0.0.0');
  }
});