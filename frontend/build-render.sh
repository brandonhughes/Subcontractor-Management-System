#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Print commands before executing them
set -x

# Check if npm exists
if ! [ -x "$(command -v npm)" ]; then
  echo 'Error: npm is not installed.' >&2
  exit 1
fi

# Copy the specialized package.json for Render
if [ -f "package-render.json" ]; then
  echo "Using specialized package.json for Render..."
  cp package-render.json package.json
fi

# Install packages including dev dependencies
echo "Installing frontend dependencies..."
npm install --include=dev --legacy-peer-deps

# Verify that react-scripts is installed
if [ -d "node_modules/react-scripts" ]; then
  echo "react-scripts found in node_modules"
else
  echo "react-scripts not found, installing explicitly..."
  npm install react-scripts@5.0.1 --save-dev --legacy-peer-deps
fi

# Make sure TypeScript version is compatible
echo "Installing compatible TypeScript version..."
npm uninstall typescript
npm install typescript@4.9.5 --save --legacy-peer-deps

# Display npm package info
echo "Checking react-scripts installation..."
npm list react-scripts

# Try to locate react-scripts
which react-scripts || true
npm bin -g

# Build the app
echo "Building frontend..."
PATH=$(npm bin):$(npm bin -g):$PATH NODE_ENV=production CI=false npm run build

echo "Build completed successfully"