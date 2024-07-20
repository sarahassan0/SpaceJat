//  Timeline Service

import { connect, StringCodec } from "nats";

(async () => {
  try {
    const nc = await connect({ servers: process.env.NATS_URL || "nats://localhost:4222" });
    const sc = StringCodec();

    console.log("Timeline Service is running");

    const sub = nc.subscribe("meeting");
    (async () => {
      for await (const msg of sub) {
        const meetingObject = JSON.parse(sc.decode(msg.data));

        const now = new Date();
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        };
        const formattedDate = now.toLocaleString("en-US", options);

        // Posting the new meeting on the timeline.
        console.log(
          `${meetingObject["meeting-host"]} is hosting a new meeting on ${formattedDate}. Join now!`
        );
      }
    })();
  } catch (err) {
    console.error("Error connecting to NATS:", err);
  }
})();
