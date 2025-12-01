import amqp from "amqplib"

async function recvMail() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue("users_mail_queue", { durable: false });

    // consume message send by producer
    // it take exchange name because
    //overall exhcange is one

    channel.consume("users_mail_queue", (message) => {
      if (message !== null) {
        // since message in string so parse it in json
        console.log(
          "Recv message for Normal user ",
          JSON.parse(message.content)
        );
        // acknowledge after receiving the messsage
        // that i got it
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

recvMail();
