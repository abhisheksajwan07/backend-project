import express from "express";
import { Worker} from "bullmq";
import { config } from "dotenv";

const app = express();
const port = 5003;
config();
app.use(express.json());


const mailWorker = new Worker("email-queue",async(job)=>{
  console.log(`job id ${job.id}`)
  const { from,
      to,
      subject,
      body} = job.data
  const sendMailToUser = await sendMail(from,to,subject,body)
},{
  connection:{
    host:"127.0.0.1",
    port:6379
  }
})
 
const sendMail = async(from,to,subject,body)=>{
  console.log("mail sent")
}
app.listen(port, () => {
  console.log("order server started");
});
