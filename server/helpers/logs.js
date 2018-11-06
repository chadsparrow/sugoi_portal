const winston = require("winston");
const path = require("path");
const fs = require("fs");
const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

winston.remove(winston.transports.Console);

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "logfile.log"),
      format: winston.format.simple(),
      timestamp: true
    })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      timestamp: true
    })
  );
}

module.exports = logger;
