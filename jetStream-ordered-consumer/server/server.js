import { WebSocketServer } from "ws";
import { connect, StringCodec } from "nats";

(async () => {
  try {
    const nc = await connect({ servers: "nats://localhost:4222" });
    const js = nc.jetstream();
    const sc = StringCodec();
    const wss = new WebSocketServer({ port: 8080 });

    wss.on("connection", (ws) => {
      console.log("Publisher is up and running");

      ws.on("message", async (message) => {

        const pubAck = await js.publish("reservation", sc.encode(message));
        console.log(`Published message, received ack: `, pubAck);
      });
    });

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
