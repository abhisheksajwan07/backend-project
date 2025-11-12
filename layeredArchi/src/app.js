

import express from "express";
import cors from "cors";
import { Config } from "./config/index.js";
import { router } from "./routes/index.route.js";

export const app = express();

app.use(
  cors({
    origin: Config.cors.origin,
    credentials: Config.cors.credentials,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(Config.api.prefix, router);

app.get("/", (req, res) => {
  res.json({
    success: true,
  });
});
