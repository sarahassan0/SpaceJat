//  Drive Service

import { connect, StringCodec } from "nats";

(async () => {
  try {
    const nc = await connect({ servers: process.env.NATS_URL || "nats://localhost:4222" });
    const sc = StringCodec();

    console.log("Drive Service is running");

    const sub = nc.subscribe("recorded_meeting", { queue: "recorded_meeting_queue" });
    (async () => {
      for await (const msg of sub) {
        const meetingObject = JSON.parse(sc.decode(msg.data));

        // "Store the recorded meeting on the drive Storage."
        console.log(
          `Drive Service Update: The meeting hosted by ${meetingObject["meeting-host"]} is being stored on the Drive Storage.`
        );
      }
    })();
  } catch (err) {
    console.error("Error connecting to NATS:", err);
  }
})();
