import fetch from "node-fetch";
import { connect, StringCodec } from "nats";

const sc = StringCodec();

const nats = await connect({
  servers: process.env.NATS_URL
});

console.log("Broadcaster connected to NATS");

const sub = nats.subscribe("todo.events", {
  queue: "broadcast-queue" 
  // THIS guarantees only ONE instance receives each message
  // even if 6 replicas run
});

for await (const msg of sub) {
  const data = JSON.parse(sc.decode(msg.data));

  console.log("Received:", data);

  const payload = {
    user: "bot",
    message: `Todo updated → ${data.text} (done: ${data.done})`
  };

  try {
    await fetch(process.env.TARGET_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    console.log("Message forwarded successfully");
  } catch (err) {
    console.error("Failed to send to external service", err);
  }
}
