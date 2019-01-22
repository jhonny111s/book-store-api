const express = require('express');
const app = express();
const config = require('config');

require('./startup/routes')(app);
require('./startup/db')();


console.log(`ENVIROMENT: ${process.env.NODE_ENV || 'default'}`);
console.log(`NAME_APP: ${config.get("appName")}`);

const port = process.env.PORT || 3000;
app.listen(port, () => console.info(`Listening on port ${port}...`));