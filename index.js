require('dotenv').config();
const express = require('express');
const app = express();
const config = require('config');
const logger = require('./startup/logger');

require('./startup/routes')(app);
require('./startup/db')(logger);


logger.info(`ENVIROMENT: ${process.env.NODE_ENV || 'default'}`);
logger.info(`NAME_APP: ${config.get("appName")}`);

const port = process.env.PORT || 3000;

// no es necesario con supertest que existan una conexion y causa prolemas
// de puerto en uso
if (process.env.NODE_ENV !== 'test') {
   app.listen(port, () => logger.info(`Listening on port ${port}...`));
};


module.exports = { app };