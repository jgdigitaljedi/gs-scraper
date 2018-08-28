const winston = require('winston');

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: '../logs/app.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: message => {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};

logger.logThis = (err, req) => {
  logger.error(
    err.status ||
    500 + ' -  ' + err.message + ' - ' + req.originalUrl + ' - ' + req.method + ' - ' + req.ip
  );
};

logger.logInfo = operation => {
  logger.info(operation);
};

logger.logWarning = warning => {
  logger.warn(warning);
};

module.exports = logger;

/*
logger.log('silly', "127.0.0.1 - there's no place like home");
logger.log('debug', "127.0.0.1 - there's no place like home");
logger.log('verbose', "127.0.0.1 - there's no place like home");
logger.log('info', "127.0.0.1 - there's no place like home");
logger.log('warn', "127.0.0.1 - there's no place like home");
logger.log('error', "127.0.0.1 - there's no place like home");
logger.info("127.0.0.1 - there's no place like home");
logger.warn("127.0.0.1 - there's no place like home");
logger.error("127.0.0.1 - there's no place like home");
*/
