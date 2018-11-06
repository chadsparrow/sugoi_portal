const winston = require("winston");
const path = require("path");
const fs = require("fs");
const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

winston.remove(winston.transports.Console);

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "MM-DD-YYYY HH:mm:ss"
    }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "logfile.log"),
      colorize: true
    })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      colorize: true
    })
  );
}

module.exports = logger;
