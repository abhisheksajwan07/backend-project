import amqp from "amqplib";

async function processBatch() {
  // 1) Batch create
  const batchId = "batch-" + Date.now();
  const orders = [
    { id: 1, item: "Laptop" },
    { id: 2, item: "Phone" },
  ];

  console.log("Batch created:", batchId, orders);

  // 2) Local processing
  await processOrders(orders);

  // 3) Send delayed message to RabbitMQ
  const delayMs = 10000; // 10 sec
  await sendDelayed(batchId, delayMs);

  console.log("Batch processed and delayed message sent!");
}

async function processOrders(orders) {
  return new Promise((resolve) => {
    console.log("Processing orders...", orders);
    setTimeout(() => resolve(), 1000);
  });
}

async function sendDelayed(batchId, delay) {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();

  const exchange = "delayed_exchange";

  // Delayed exchange create
  await ch.assertExchange(exchange, "x-delayed-message", {
    arguments: { "x-delayed-type": "direct" },
  });

  const msg = JSON.stringify({ batchId });

  ch.publish(exchange, "", Buffer.from(msg), {
    headers: { "x-delay": delay },
  });

  console.log(`Sent batch ${batchId} with ${delay} ms delay`);

  await ch.close();
  await conn.close();
}

processBatch();
