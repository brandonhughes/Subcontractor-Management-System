#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Print commands before executing them
set -x

# Check if npm exists
if ! [ -x "$(command -v npm)" ]; then
  echo 'Error: npm is not installed.' >&2
  exit 1
fi

# Install packages including dev dependencies
echo "Installing frontend dependencies..."
npm install --include=dev --legacy-peer-deps

# Create build directory for AWS deployment
mkdir -p aws-build

# Build the app with AWS configuration
echo "Building frontend for AWS deployment..."
PATH=$(npm bin):$(npm bin -g):$PATH NODE_ENV=production CI=false npm run build:aws

# Copy AWS-specific files to build directory
echo "Copying AWS deployment files..."
cp -r build/* aws-build/

# Create AWS deployment package
echo "Creating AWS deployment package..."
cd aws-build
zip -r ../aws-deployment.zip .
cd ..

echo "AWS build completed successfully. Deployment package created at: aws-deployment.zip"
echo "Upload this zip file to your AWS S3 bucket or use the AWS Amplify Console to deploy it."
