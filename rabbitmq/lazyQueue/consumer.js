import { getChannel } from "./connection.js";

const QUEUE = "lazy_notifications_queue";

export const startConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue(QUEUE, {
    durable: true,
    arguments: {
      "x-queue-mode": "lazy",
    },
  });

  console.log(` Waiting for messages in: ${QUEUE}`);

  channel.consume(
    QUEUE,
    (msg) => {
      if (!msg) return;

      const content = msg.content.toString();
      console.log(` Received: ${content}`);

      channel.ack(msg);
    },
    { noAck: false }
  );
};
