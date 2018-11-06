const { createLogger, format, transports } = require("winston");
const { combine, timestamp, prettyPrint } = format;
const path = require("path");
const fs = require("fs");
const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logDir, "logfile.log") })
  ]
});

module.exports = logger;
