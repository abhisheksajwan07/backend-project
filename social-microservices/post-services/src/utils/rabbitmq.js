import amqp from "amqplib";
import { logger } from "./logger.js";

let connection = null;
let channel = null;
const EXCHANGE_NAME = "micro_events";

//create conection
export async function connectToRabbitMQ() {
  try {
    //create channel
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });
    logger.info("Conected to  rabbit mq");
    return channel;
  } catch (err) {
    logger.error("error connecting to rabbit mq", err);
  }
}

export async function publishEvent(routingKey, message) {
  if (!channel) {
    await connectToRabbitMQ();
  }
  channel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message))
  );
  logger.info(` Event published: ${routingKey}`);
}
