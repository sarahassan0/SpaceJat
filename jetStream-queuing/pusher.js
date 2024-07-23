import { connect, StringCodec } from "nats";

(async () => {
  try {
    // Connect to NATS
    const nc = await connect({ servers: "nats://localhost:4222" });
    const js = nc.jetstream();
    const sc = StringCodec();

    console.log("Publisher is up and running");

    // Publish messages to the stream
    setInterval(async () => {
      const message = `Hello from JetStream, message received at ${new Date().toISOString()}`;
      await js.publish("message", sc.encode(message));
      console.log(`Published message: ${message}`);
    }, 5000);

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
