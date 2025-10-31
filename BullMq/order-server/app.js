import express from "express";
import { Queue, QueueEvents } from "bullmq";
import { config } from "dotenv";

const app = express();
const port = 5000;
config();
app.use(express.json());

const emailNotification = new Queue("email-queue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  },
});
const verifyUser = new Queue("user-verification-queue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000);
    },
  },
});

// to catch events returned by user-server
const verificationQueueEvents = new QueueEvents("user-verification-queue", {
  connection: { host: "127.0.0.1", port: 6379 },
});

const checkUserVerification = (jobId) => {
  return new Promise((resolve, reject) => {
    verificationQueueEvents.on(
      "completed",
      ({ jobId: completedJobId, returnvalue }) => {
        if (jobId === completedJobId) {
          const { isValidUser, userData } = returnvalue;
          resolve({ isValidUser, userData });
        }
      }
    );

    verificationQueueEvents.on(
      "failed",
      ({ jobId: failedJobId, failedReason }) => {
        if (jobId === failedJobId) {
          reject(new Error(failedReason));
        }
      }
    );
  });
};

app.post("/order", async (req, res) => {
  try {
    const { orderId, productName, price, userId } = req.body;
    // verifyuser queue created
    const job = await verifyUser.add("verify-user", { userId });
    console.log("Order-server: job added", job.id, "for userId", userId);
    // yaha code block hogya jab tk user verify nahi hoga aage nahi badhega
    let { isValidUser, userData } = await checkUserVerification(job.id);

    if (!isValidUser) {
      return res.send({
        message: "user isnot valid",
      });
    }

    // save order to db
    // all do ncerssary works first and less important task async
    const mailJob = await emailNotification.add("send mail", {
      from: "apnicompany@gmail.com",
      to: userData.email,
      subject: "thank you",
      body: "success placing order",
    });

    res.send({
      message: "user is valid",
      mailJob: mailJob.id,
      userData,
    });
  } catch (err) {
    console.log({ err });
  }
});

app.listen(port, () => {
  console.log("order server started");
});
