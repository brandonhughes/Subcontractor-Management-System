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
  console.log(`Server listening on port ${port}`);
  console.log(`Server address: ${JSON.stringify(server.address())}`);
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