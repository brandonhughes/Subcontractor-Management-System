#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Print commands before executing them
set -x

echo "Setting up environment for Render deployment..."

# Clean up node_modules if they exist
if [ -d "frontend/node_modules" ]; then
  echo "Cleaning frontend node_modules..."
  rm -rf frontend/node_modules
fi

if [ -d "backend/node_modules" ]; then
  echo "Cleaning backend node_modules..."
  rm -rf backend/node_modules
fi

# Ensure scripts are executable
chmod +x frontend/build-render.sh
chmod +x build.sh

# Make a clean install of react-scripts globally
npm install -g react-scripts

echo "Setup completed successfully"