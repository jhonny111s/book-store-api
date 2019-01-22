const mongoose = require('mongoose');
const config = require('config');

module.exports = function(logger) {
  const dbConfig = config.get('dbConfig');
  const url = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;

  if (!(config.has('dbConfig.user') && config.has('dbConfig.password'))) {
    logger.error("DB user or password enviroment variable undefined");
    // process.exit(1);
  } 

  mongoose.connect(url,
    { 
      "auth": {"authSource": "admin"},
      "user": dbConfig.user, // root
      "pass": dbConfig.password, // password
  })
    .then(() => logger.info(`Connect to ${url}`))
    .catch((err) => {
      logger.error(err);
    });
}