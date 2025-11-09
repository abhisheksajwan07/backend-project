import { app } from "./src/app";
import config from "./src/config";
import { DatabaseConfig } from "./src/config/database";

const startServer = async () => {
  try {
    await DatabaseConfig.connect();
    app.listen(config.port, () => {
      console.log("SERVER STARTED");
    });
  } catch (error) {
    console.error("failed tostart server:", error);
    process.exit();
  }
};
startServer();
