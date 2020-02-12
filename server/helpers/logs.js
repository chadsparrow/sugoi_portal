const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
const logDir = 'logs';
const moment = require('moment-timezone');
const dayjs = require('dayjs');

if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const appendTimestamp = winston.format((info, opts) => {
	if (opts.tz) {
		info.timestamp = moment(dayjs().format())
			.tz(opts.tz)
			.format();
		return info;
	}
});

winston.remove(winston.transports.Console);

const logger = winston.createLogger({
	format: winston.format.combine(
		appendTimestamp({ tz: 'America/Los_Angeles' }),
		winston.format.simple()
	),
	transports: [
		new winston.transports.DailyRotateFile({
			filename: path.join(logDir, 'customproofs-%DATE%.log'),
			maxFiles: '14d'
		})
	]
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			colorize: true
		})
	);
}

module.exports = logger;
