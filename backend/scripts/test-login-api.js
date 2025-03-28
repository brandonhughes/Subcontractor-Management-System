const http = require('http');
const { exec } = require('child_process');

// Check if server is reachable
// Using http instead of curl
const checkServer = http.get('http://localhost:5001', (res) => {
  console.log(`Server status check result: ${res.statusCode}`);
  res.resume(); // Consume response
}).on('error', (err) => {
  console.log(`Error checking server: ${err.message}`);
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const requestData = JSON.stringify({
  username: 'brandonhughes',  // Try with username instead of email
  password: 'password123'
});

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  console.error('Error object:', e);
});

// Write data to request body
req.write(requestData);
req.end();

console.log('Test login request sent to API...');