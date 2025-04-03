/**
 * AWS Pre-build script
 * This script prepares the React application for deployment to AWS
 */

const fs = require('fs');
const path = require('path');

// Ensure the API URL points to the correct endpoint for AWS
console.log('Configuring environment for AWS deployment...');

// Create a .env file that will be used during build time
const envContent = `
# AWS deployment configuration
REACT_APP_API_URL=/api
REACT_APP_ENV=production
`;

fs.writeFileSync(path.join(__dirname, '..', '.env'), envContent);
console.log('Created .env file with AWS configuration');

// Create AWS deployment configuration file
const awsConfigPath = path.join(__dirname, '..', 'aws-config.json');
const awsConfig = {
  region: 'us-east-1', // Change this to your preferred AWS region
  s3Bucket: 'subcontractor-management-system', // Change this to your S3 bucket name
  cloudFrontDistribution: '', // Optional: Your CloudFront distribution ID if using CloudFront
  apiGateway: '/api', // API Gateway endpoint or API path
};

fs.writeFileSync(awsConfigPath, JSON.stringify(awsConfig, null, 2));
console.log('Created aws-config.json for deployment');

console.log('AWS pre-build configuration complete!');
