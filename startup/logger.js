const winston = require('winston');

const myFormat = winston.format.printf(info => {
    return `${info.timestamp}: ${info.level.toUpperCase()}: ${info.message}`;
  });

module.exports = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(), myFormat),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log', level: 'info' })
    ]
});