import { WebSocketServer } from "ws";
import { connect, StringCodec } from "nats";
import { v4 as uuidv4 } from "uuid";

const socketObj = {};

(async () => {
  try {
    const nc = await connect({ servers: "nats://localhost:4222" });
    const js = nc.jetstream();
    const sc = StringCodec();
    const wss = new WebSocketServer({ port: 8080 });

    console.log("Market is up and running");
    wss.on("connection", (ws) => {
      const clientId = uuidv4();
      socketObj[clientId] = ws;
      console.log(`Client ${clientId} Connected`);

      ws.on("message", async (message) => {
        console.log(`Server: Client (${clientId}) Order No. ${message}`);
        let obj = {
          message: message.toString(),
          clientId,
        };
        await js.publish("reservation", sc.encode(JSON.stringify(obj)));
      });

      ws.on("close", () => {
        console.log(`Client: ${clientId} Done`);
        delete socketObj[clientId];
        console.log(`Client ${clientId} disconnected`);
      });
    });

    // Store Component
    const c = await js.consumers.get(
      "reservationStream",
      "reservationConsumer"
    );

    while (true) {
      let messages = await c.fetch({ expires: 2000, max_messages: 20 });
      for await (const m of messages) {
        let { message, clientId } = JSON.parse(sc.decode(m.data));
        const ws = socketObj[clientId];
        if (ws) {
          await setTimeout(() => {}, 5000);
          ws.send(`Store: Client (${clientId}) invoice NO. ${message}`);
          m.ack();
        }
      }
    }

    ////////////////////////////////////////////////

    process.on("SIGINT", async () => {
      await nc.drain();
      console.log("Publisher connection closed");
      process.exit();
    });
  } catch (err) {
    console.error("Error connecting to NATS:", err);
  }
})();
