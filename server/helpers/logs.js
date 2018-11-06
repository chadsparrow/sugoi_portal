const winston = require("winston");
const path = require("path");
const fs = require("fs");
const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDir, "logfile.log") })
  ]
});

module.exports = logger;
