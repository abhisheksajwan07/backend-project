import express from "express";
import { Queue, Worker } from "bullmq";
import { config } from "dotenv";
const app = express();
const port = 5001;
config();

app.use(express.json());
const userDb = [
  {
    id: 3,
    name: "rahul",
    password: 123456,
    email: "rahul@gmail.com",
  },
];
const verificationWorker = new Worker(
  "user-verification-queue",
  (job) => {
    const userId = job.data.userId;
    console.log(`Received verification job with id => ${userId},  ${job.id}`);

    const isValidUser = userDb.some((item) => item.id === userId);
    console.log(`user valid ${isValidUser}`);

    const { password, ...rest } = userDb[0];
    return { isValidUser, userData: rest };
    // it return as a event
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

app.listen(port, () => {
  console.log("user server started");
});
