const winston = require('winston');

const myFormat = winston.format.printf(info => {
    return `${info.timestamp}: ${info.level.toUpperCase()}: ${info.message}`;
  });

 const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(), myFormat),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
});


if (process.env.NODE_ENV !== 'production') {
    logger
        .add(new winston.transports.Console())
        .add(new winston.transports.File({ filename: 'combined.log', level: 'info' }))
}

module.exports = logger