// Notification Service

import { connect, StringCodec } from "nats";

(async () => {
  try {
    const nc = await connect({ servers: process.env.NATS_URL || "nats://localhost:4222" });
    const sc = StringCodec();
    console.log("Notification Service is running");

    const sub = nc.subscribe("meeting");
    (async () => {
      for await (const msg of sub) {
        const meetingObject = JSON.parse(sc.decode(msg.data));
        console.log(
          `You have a new notification update: ${meetingObject["meeting-host"]} is hosting a new meeting. Join now!`
        );
      }
    })();
  } catch (err) {
    console.error("Error connecting to NATS:", err);
  }
})();
