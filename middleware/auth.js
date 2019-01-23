const jwt = require('jsonwebtoken');
const config = require('config');
const logger = require('../startup/logger');

if (!config.has('jwtSecretKey')) {
  logger.error('jwtSecretKey is not defined');
  process.exit(1);
}

const secret_key = config.get('jwtSecretKey');

module.exports = function (req, res, next) {
    const secretKey = secret_key;
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Unauthorized - No token provided.');

    jwt.verify(token, secretKey, function(err, decoded) {
        if (err)  return res.status(401).send(`Unauthorized - ${err}.`);
        if ((decoded.permissions && decoded.permissions[req.baseUrl] 
            && decoded.permissions[req.baseUrl].includes(req.method))
            || decoded.isAdmin === true ){
            next();
        }
        else {
            res.status(403).send('Forbidden');
        }
      });
}