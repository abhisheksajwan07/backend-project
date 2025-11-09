import mongoose from "mongoose";



//    without static
// class Database {
//   async connect() {
//     console.log("Connected");
//   }
// }
// const db = new Database(); // object banana padega
// db.connect();

export class DatabaseConfig {
  static async connect() {
    try {
      const mongoURI = process.env.MONGODB_CONNECT_URI;
      if (!mongoURI) {
        throw new Error("mongodb connection uri isnt defined in env variables");
      }
      const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      };

      await mongoose.connect(mongoURI, options);
      console.log("DB connected");
    } catch (err) {
      console.log("Failed to connect to MongoDB:", error.message);
      process.exit(1);
    }
  }
  static async disconnect() {
    try {
      await mongoose.disconnect();
      console.log("MongoDB disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
    }
  }
}
