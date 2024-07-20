// Meeting Service

import { WebSocketServer } from "ws";
import { connect, StringCodec } from "nats";

(async () => {
  try {
    const nc = await connect({ servers: process.env.NATS_URL || "nats://localhost:4222" });
    const sc = StringCodec();
    const wss = new WebSocketServer({ port: 8765 });

    wss.on("connection", (ws) => {
      console.log("Meeting Service is running");

      ws.on("message", async (message) => {
        const meetingObject = JSON.parse(message);
        console.log(`${meetingObject["meeting-host"]} is hosting a new meeting`);

        // Publish to 'meeting' subject
        await nc.publish("meeting", sc.encode(JSON.stringify(meetingObject)));

        // If meeting is recorded, publish to 'recorded_meeting' subject to be stored on one of the storage services
        if (meetingObject.recorded) {
          await nc.publish("recorded_meeting", sc.encode(JSON.stringify(meetingObject)));
        }
      });
    });
  } catch (err) {
    console.error("Error connecting to NATS:", err);
  }
})();