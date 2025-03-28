/**
 * Simple Express server based on Render's recommended example
 * https://render.com/docs/web-services
 */

const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

console.log(`Starting server on port ${port}`);

// Simple root route for health checks
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    port: port,
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});