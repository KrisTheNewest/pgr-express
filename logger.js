const winston = require("winston");

const format = winston.format.combine(
	winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms' }),
	// winston.format.prettyPrint(),
	winston.format.colorize({ all: true }),
	winston.format.printf(
		(info) => `${info.timestamp} ${info.level}: ${info.name}\n${info.stack}`,
	  ),
);
const transports = [
	new winston.transports.Console(),
];

const Logger = winston.createLogger({
	level: "silly",
	format,
	transports,
});

module.exports = Logger;
  