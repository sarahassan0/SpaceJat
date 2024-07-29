// Client B

import { WebSocket } from "ws";

const wsUrl = "ws://localhost:8080";

const ws = new WebSocket(wsUrl);

ws.on("open", () => {
  console.log("WebSocket connection opened");

  for (let i = 0; i < 20; i++) {
    ws.send(i + 1);
    console.log(`Client B: ${i + 1}St User reservation `);
  }
  console.log("Client B Done");
});
// // Event handler for when a message is received from the server
ws.on("message", (message) => {
  console.log(`Client B: ${message}`);
});

ws.on("error", (error) => {
  console.error(`WebSocket error: ${error.message}`);
});

ws.on("close", () => {
  console.log("Client connection closed");
});
