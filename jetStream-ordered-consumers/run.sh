#!/bin/bash

# Start the WebSocket server (server.js) in the background
echo "Starting WebSocket cleints..."
nodemon cleint.js & nodemon cleint2.js
SERVER_PID=$!

