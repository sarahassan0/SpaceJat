import { connect, StringCodec } from "nats";
// import { socketObj } from "./server.js";

(async () => {
  try {
    const nc = await connect({ servers: "nats://localhost:4222" });
    const js = nc.jetstream();
    const sc = StringCodec();

    console.log("Store is up and running");

    const c = await js.consumers.get(
      "reservationStream",
      "reservationConsumer"
    );

    while (true) {
      let messages = await c.fetch({ expires: 2000, max_messages: 20 });
      for await (const m of messages) {
        let { message, clientId } = JSON.parse(sc.decode(m.data));
        console.log(`Processing message for client ${clientId}: ${message}`);
        // const ws = socketObj[clientId];
        // if (ws) {
        //   ws.send(`Processed message: ${message}`);
        m.ack();
      }
      console.log(` Done`);
      setTimeout(async () => {}, 2000);
    }

    process.on("SIGINT", async () => {
      await nc.drain();
      console.log("First Worker connection closed");
      process.exit();
    });
  } catch (err) {
    console.error("Error connecting to NATS:", err);
  }
})();
