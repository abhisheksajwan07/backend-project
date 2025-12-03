import amqplib from "amqplib";

let connection = null;
let channel = null;

export const connectRabbit = async () => {
  try {
    connection = await amqplib.connect("amqp://localhost");
    channel = await connection.createChannel();
    console.log(" RabbitMQ connected");
    return channel;
  } catch (err) {
    console.error("RabbitMQ Connection Error:", err);
  }
};

export const getChannel = () => channel;
