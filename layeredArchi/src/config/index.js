import { config } from "dotenv";
config();

export const Config = {
  port: process.env.PORT || 5000,

  mongodb: {
    uri: process.env.MONGODB_CONNECT_URI,
  },

  api: {
    prefix: "/api",
    version: "v1",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },
};
