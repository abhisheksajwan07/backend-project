import amqp from "amqplib";

async function sendMail() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "mail_exchange";
    const routingKeyForSubUser = "send_mail_to_subscribed_users";
    const routingKeyForNormalUser = "send_mail_to_users";

    const message = {
      to: "normalUser@gmail.com",
      from: "harish@gmail.com",
      subject: "Thank you!!",
      body: "Hello ABC!!",
    };
    // create a exchange
    // exchange will send the message to the queue with help of routing key
    await channel.assertExchange(exchange, "direct", { durable: false });
    await channel.assertQueue("subscribed_users_mail_queue", {
      durable: false,
    });
    await channel.assertQueue("users_mail_queue", { durable: false });

    // Bind queues to exchange with routing keys
    //await channel.bindQueue(<queueName>, <exchangeName>, <routingKey>);

    await channel.bindQueue(
      "subscribed_users_mail_queue",
      exchange,
      routingKeyForSubUser
    );
    await channel.bindQueue(
      "users_mail_queue",
      exchange,
      routingKeyForNormalUser
    );
    channel.publish(
      exchange,
      routingKeyForNormalUser,
      Buffer.from(JSON.stringify(message))
    );
    console.log("mail data sent", message);

    

    setTimeout(() => {
      connection.close();
    }, 500);

  } catch (err) {
    console.log(err);
  }
}
sendMail();
