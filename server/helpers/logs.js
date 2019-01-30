const winston = require("winston");
const fs = require("fs");
const path = require ("path");
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

// const transport = new winston.transports.DailyRotateFile({
//   filename: "./logs/logfile.log"
// });

// transport.on("rotate", function(oldFilename, newFileName) {
//   //do something
// });

winston.remove(winston.transports.Console);

const logger = winston.createLogger({
  format: winston.format.combine(
    appendTimestamp({ tz: "America/Los_Angeles" }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "logfile.log"),
      colorize:true
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
