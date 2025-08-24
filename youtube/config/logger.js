import winston from "winston";
import fs from "fs";
import path from "path";

// Logs folder
const logDir = path.join(".", "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const { combine, timestamp, printf, colorize } = winston.format;


const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});


const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    colorize(),
    myFormat
  ),
  transports: [
    new winston.transports.Console(), // console me log
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }), // error logs
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }), // all logs
  ],
});

export default logger;
