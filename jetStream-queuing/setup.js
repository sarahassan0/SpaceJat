import { connect } from "nats";

(async () => {
  try {
    const nc = await connect({ servers: "nats://localhost:4222" });
    const jsm = await nc.jetstreamManager();

    const streamName = "messageStream";
    const consumerName = "messageConsumer";

    // Create the stream if it doesn't exist
    try {
      await jsm.streams.add({ name: streamName, subjects: ["message"] });
      console.log("Stream created successfully");
    } catch (err) {
        console.error("Error creating stream:", err);      
    }

    // Create the consumer if it doesn't exist
    try {
      await jsm.consumers.add(streamName, {
        durable_name: consumerName,
        ack_policy: "all",
        deliver_group: "workerGroup",
      });
      console.log(`Consumer ${consumerName} created successfully`);
    } catch (err) {
      console.log("Error creating consumer:", err);
    }

    // Handle process termination
    process.on("SIGINT", async () => {
      await nc.drain();
      console.log("Publisher connection closed");
      process.exit();
    });
  } catch (err) {
    console.error("Error connecting to NATS:", err);
  }
})();
