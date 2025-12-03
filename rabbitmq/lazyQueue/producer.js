import { getChannel } from "./connection.js";

const EXCHANGE = "notifications_exchange";
const QUEUE = "lazy_notifications_queue";
const ROUTING_KEY = "notification_key";

export const setupProducer = async () => {
  const channel = getChannel();
  await channel.assertExchange(EXCHANGE, "direct", { durable: true });

  await channel.assertQueue(QUEUE, {
    durable: true,
    arguments: {
      "x-queue-mode": "lazy",
    },
  });
  await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);
  console.log(" Producer setup complete");
};

export const sendMessage = async (message) => {
  const channel = getChannel();

  const buffer = Buffer.from(JSON.stringify(message));

  channel.publish(EXCHANGE, ROUTING_KEY, buffer, {
    persistent: true,
  });

  console.log(` Message sent → ${JSON.stringify(message)}`);
};