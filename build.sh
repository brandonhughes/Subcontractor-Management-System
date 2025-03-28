#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Print commands before executing them
set -x

# Determine which part to build based on argument
if [ "$1" == "backend" ] || [ "$1" == "all" ]; then
  echo "Installing backend dependencies..."
  cd backend
  npm install
  cd ..
fi

if [ "$1" == "frontend" ] || [ "$1" == "all" ]; then
  echo "Installing frontend dependencies..."
  cd frontend
  npm install
  
  echo "Building frontend..."
  npm run build
  cd ..
fi

echo "Build process completed successfully."