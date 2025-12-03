import { connectRabbit } from "./connection.js";
import { setupProducer, sendMessage } from "./producer.js";
import { startConsumer } from "./consumer.js";

const start = async () => {
  await connectRabbit();
  await setupProducer();
  await startConsumer();

  // Send test message
  sendMessage({ text: "Hello from lazy queue!" });
};

start();
