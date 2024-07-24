import { connect, StringCodec } from "nats";

(async () => {
  try {
    const nc = await connect({ servers: "nats://localhost:4222" });
    const js = nc.jetstream();
    const sc = StringCodec();

    console.log("Store is up and running");

    const c = await js.consumers.get("reservationStream", {
      durable_name: "reservationConsumer",
    });

    while (true) {
      // Fetch messages from the consumer
      let messages = await c.fetch({ max_messages: 10 });

      // Iterate over messages
      for await (const m of messages) {
        console.log(
          `First Store: ${sc.decode(
            m.data
          )} received a new message: ${sc.decode(m.data)}`
        );
        m.ack();
      }

      console.log("Waiting for messages");
    }

    process.on("SIGINT", async () => {
      await nc.drain();
      console.log(" First Worker connection closed");
      process.exit();
    });
  } catch (err) {
    console.error("Error connecting to NATS:", err);
  }
})();
