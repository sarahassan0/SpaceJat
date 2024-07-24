import { WebSocket } from "ws";

// Replace with your WebSocket server URL
const wsUrl = "ws://localhost:8080";

// Create a new WebSocket client
const ws = new WebSocket(wsUrl);

// Event handler for when the connection is open
ws.on("open", () => {
  console.log("WebSocket connection opened");

  // Send 1000 messages
  for (let i = 0; i < 1000; i++) {
    ws.send(i + 1);
    console.log(`${i + 1}St User reservation `);
  }
});

// Event handler for when a message is received from the server
ws.on("message", (message) => {
  console.log(`Received: ${message}`);
});

// Event handler for when there is an error
ws.on("error", (error) => {
  console.error(`WebSocket error: ${error.message}`);
});

// Event handler for when the connection is closed
ws.on("close", () => {
  console.log("WebSocket connection closed");
});
