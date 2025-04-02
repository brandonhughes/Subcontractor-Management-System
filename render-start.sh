#!/bin/bash

# Kill any existing Node processes
echo "Checking for existing Node processes..."
killall node || echo "No existing Node processes found"

# Log the environment
echo "================================="
echo "RENDER STARTUP SCRIPT"
echo "================================="
echo "PORT: $PORT"
echo "NODE_ENV: $NODE_ENV"
echo "Working directory: $(pwd)"
echo "Listing files:"
ls -la
echo "================================="

# Start the server
echo "Starting the main application server..."
node server.js