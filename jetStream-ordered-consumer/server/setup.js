import { connect } from "nats";

(async () => {
  try {
    const nc = await connect({ servers: "nats://localhost:4222" });
    const jsm = await nc.jetstreamManager();

    const streamName = "reservationStream";
    const consumerName = "reservationConsumer";

    // Create the stream if it doesn't exist
    try {
      await jsm.streams.add({ name: streamName, subjects: ["reservation"] });
      console.log("Stream created successfully");
    } catch (err) {
      console.error("Error creating stream:", err);
    }

    // Create the consumer if it doesn't exist
    try {
      await jsm.consumers.add(streamName, {
        durable_name: consumerName,
        ack_policy: "all",
        // deliver_group: "store",
        // deliver_subject: 'orderedMessages'
      });
      console.log(`Consumer ${consumerName} created successfully`);
    } catch (err) {
      console.log("Error creating consumer:", err);
      await jsm.consumers.delete(streamName, consumerName);
    }
  } catch (err) {
    console.error("Error connecting to NATS:", err);
  }
})();
