const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
  const dbConfig = config.get('dbConfig');
  const url = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`;

  if (!(config.has('dbConfig.user') && config.has('dbConfig.password'))) {
    console.log("Database error: DB user or password undefined");
    process.exit(1);
  } 

  mongoose.connect(url,
    { 
      "auth": {"authSource": "admin"},
      "user": dbConfig.user, // root
      "pass": dbConfig.password, // password
  })
    .then(() => console.log(`Connect to ${url}`))
    .catch((err) => {
      console.log("Database error:", err);
    });
}