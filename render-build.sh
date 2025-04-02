#!/bin/bash
set -e

echo "🚀 Render build script starting..."

# Set environment variables
export PORT=10000
export NODE_ENV=production

# Start both port detection servers in the background for redundancy
echo "📡 Starting HTTP port detection server on port $PORT..."
node build-detect-port.js > port-server.log 2>&1 &
HTTP_SERVER_PID=$!

echo "📡 Starting Express port detection server on port $PORT..."
# Use a different port for express to avoid conflicts
export EXPRESS_PORT=$((PORT + 1))
PORT=$EXPRESS_PORT node express-detect-port.js > express-server.log 2>&1 &
EXPRESS_SERVER_PID=$!

# Verify the servers are running
echo "⏱️ Waiting 5 seconds for servers to start..."
sleep 5

echo "🔍 Testing HTTP server..."
curl -s http://localhost:$PORT || echo "Warning: HTTP server health check failed, but continuing..."

echo "🔍 Testing Express server..."
curl -s http://localhost:$EXPRESS_PORT || echo "Warning: Express server health check failed, but continuing..."

# Dump log files for debugging
echo "📋 Server logs:"
echo "--- HTTP Server Log ---"
cat port-server.log
echo "--- Express Server Log ---"
cat express-server.log

# Install dependencies and build the application
echo "📦 Installing dependencies and building the application..."
npm run build:all

# Keep the server running a bit longer to ensure Render detects it
echo "🔄 Keeping port detection server running for 30 more seconds..."
sleep 30

# Kill the servers
echo "🛑 Shutting down port detection servers..."
kill $HTTP_SERVER_PID || true
kill $EXPRESS_SERVER_PID || true

# Show process status for debugging
echo "📊 Process status:"
ps -ef | grep -E 'node|server' | grep -v grep

echo "✅ Build process completed successfully!"
exit 0