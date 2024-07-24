import { connect, StringCodec } from "nats";

(async () => {
  try {
    const nc = await connect({ servers: "nats://localhost:4222" });
    const js = nc.jetstream();
    const sc = StringCodec();

    console.log("Second Worker is up and running");

    const c = await js.consumers.get("messageStream", "messageConsumer");

    while (true) {
      let messages = await c.fetch({ max_messages: `20`, expires: 2000 });
      for await (const m of messages) {
        console.log(`Second Worker received a new message: ${m.data}`);
        m.ack();
      }
      console.log("waiting for messages");
    }

    process.on("SIGINT", async () => {
      await nc.drain();
      console.log("Second Worker connection closed");
      process.exit();
    });
  } catch (err) {
    console.error("Error connecting to NATS:", err);
  }
})();
 