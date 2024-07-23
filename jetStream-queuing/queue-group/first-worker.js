import { connect, StringCodec } from "nats";

(async () => {
  try {
    const nc = await connect({ servers: "nats://localhost:4222" });
    const js = nc.jetstream();
    const sc = StringCodec();

    console.log("First Worker is up and running");

    const c = await js.consumers.get("messageStream", "messageConsumer");
    let messages = await c.fetch({ max_messages: `20`, expires: 2000 });
    for await (const m of messages) {
      console.log(`First Worker received a new message: ${m.data}`);
      m.ack();
    }

    console.log(`batch completed: ${messages.getProcessed()} msgs processed`);
    console.log("waiting for messages");

    await c.consume({
      callback: (m) => {
        console.log(sc.decode(m.data));
        m.ack();
      },
    });

    process.on("SIGINT", async () => {
      await nc.drain();
      console.log(" First Worker connection closed");
      process.exit();
    });
  } catch (err) {
    console.error("Error connecting to NATS:", err);
  }
})();
