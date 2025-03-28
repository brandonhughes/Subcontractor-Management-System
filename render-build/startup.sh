#!/bin/bash

# Log environment details
echo "***** STARTUP SCRIPT *****"
echo "PORT: $PORT"
echo "NODE_ENV: $NODE_ENV"
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

# Start the application with explicit port binding
node server.js