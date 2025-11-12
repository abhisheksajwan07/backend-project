import { app } from "./app.js";
import { Config } from "./config/index.js";
import { DatabaseConfig } from "./config/database.js";

const startServer = async () => {
  try {
    await DatabaseConfig.connect();

    app.listen(Config.port, () => {
      console.log("SERVER started");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
