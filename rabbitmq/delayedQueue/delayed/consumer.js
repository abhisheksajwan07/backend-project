import amqp from "amqplib";

async function startConsumer() {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();

  const exchange = "delayed_exchange";
  const queue = "delayed_batch_queue";

  // Same exchange assert
  await ch.assertExchange(exchange, "x-delayed-message", {
    arguments: { "x-delayed-type": "direct" },
  });

  // Queue create
  await ch.assertQueue(queue, { durable: true });

  // Bind queue to exchange
  await ch.bindQueue(queue, exchange, "");

  console.log("Waiting for delayed messages...");

  ch.consume(queue, async (msg) => {
    const data = JSON.parse(msg.content.toString());
    console.log("\n🔥 Delayed task received for:", data.batchId);

    await updateOrderStatus(data.batchId);

    ch.ack(msg);
  });
}

async function updateOrderStatus(batchId) {
  return new Promise((resolve) => {
    console.log("Updating order status for:", batchId);
    setTimeout(() => {
      console.log("Status updated to: SHIPPING STARTED");
      resolve();
    }, 1000);
  });
}

startConsumer();
