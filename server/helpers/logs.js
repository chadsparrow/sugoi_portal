const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");
const logDir = "logs";
const moment = require("moment-timezone");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz) {
    info.timestamp = moment()
      .tz(opts.tz)
      .format();
    return info;
  }
});

const transport = new winston.transports.DailyRotateFile({
  filename: "portal-log-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH"
});

transport.on("rotate", function(oldFilename, newFileName) {
  //do something
});

winston.remove(winston.transports.Console);

const logger = winston.createLogger({
  format: winston.format.combine(
    appendTimestamp({ tz: "America/Vancouver" }),
    winston.format.simple()
  ),
  transports: [transport]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      colorize: true
    })
  );
}

module.exports = logger;
