#!/bin/bash

# Kill any existing Node processes related to port detection
echo "Checking for existing Node processes..."
echo "Processes currently running:"
ps -ef | grep node

# Try different ways to kill the processes
echo "Trying killall..."
killall node || echo "killall command failed or no processes found" 

echo "Trying pkill..."
pkill -f "express-detect-port.js" || echo "No express-detect-port.js processes found"
pkill -f "node express-detect-port.js" || echo "No node express-detect-port.js processes found"

echo "Trying process search and kill..."
pgrep -f "node express-detect-port.js" | xargs kill -9 || echo "No processes found via pgrep"

echo "Processes after cleanup:"
ps -ef | grep node

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