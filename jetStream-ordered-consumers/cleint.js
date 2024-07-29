// Client A

import { WebSocket } from "ws";

const wsUrl = "ws://localhost:8080";

const ws = new WebSocket(wsUrl);

ws.on("open", () => {
  console.log("WebSocket connection opened");

  for (let i = 0; i < 20; i++) {
    ws.send(i + 1);
    console.log(`Client A: ${i + 1}St User reservation `);
  }
  console.log("Client A Done");
});

// Event handler for when a message is received from the server
ws.on("message", (message) => {
  console.log(`Client A: ${message}`);
});

ws.on("error", (error) => {
  console.error(`WebSocket error: ${error.message}`);
});

ws.on("close", () => {
  console.log("Client A connection closed");
});
