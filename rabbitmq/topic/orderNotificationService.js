import amqp from "amqplib"

const receiveMessages = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const queue = "order_queue";

        await channel.assertExchange(exchange, "topic", { durable: true });
        await channel.assertQueue(queue, { durable: true });
    // queue,excahnge and pattern
        await channel.bindQueue(queue, exchange, "order.*");

        console.log("Waiting for messages");
        channel.consume(
            queue,
            (msg) => {
                if (msg !== null) {
                    console.log(
                        `[Order Notification] Msg was consumed! with routing key as ${msg.fields.routingKey} and content as ${msg.content.toString()}`
                    );
                    channel.ack(msg);
                }
            },
            { noAck: false }
        );
    } catch (error) {
        console.error("Error:", error);
    }
};

receiveMessages();