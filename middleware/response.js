const logger = require('../startup/logger');
//Middleware para generar las respuesta de nuestra api y así agregar el logger
//sin duplicar código.
module.exports = function(req,res, next){
    res.generateResponse = function (statusCode, headers= null, message= null) {
      const logMessage = `[${req.method} - ${req.baseUrl}]::[${typeof(message) != 'object' ? message : JSON.stringify(message)}]`;
      switch (true) {
        case statusCode < 399:
          logger.info(logMessage);
          break;
  
        case statusCode < 499:
          logger.warn(logMessage);
          break;
  
        case statusCode < 599:
          logger.error(logMessage);
          message = null;
          break;
      }
  
      if (headers && Object.keys(headers).length > 0) res.header(headers);
      return res.status(statusCode).send(message);
    };
    next()
  }