import express from "express";
import { config } from "dotenv";

import { ConnectDb } from "./config/db.config.js";
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js"
config();

const app = express();
ConnectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);
app.use("api/v1/video",videoRoutes)

app.listen(process.env.PORT, () => {
  console.log(`server is running at http://localhost:${process.env.PORT}`);
});
