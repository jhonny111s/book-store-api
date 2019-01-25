const config = require('config');
const jwt = require('jsonwebtoken');
  
const secret_key = config.get('jwtSecretKey');

function generateAuthToken(payload) { 
    const option = { expiresIn: "180000" };
    const secretKey = secret_key;
    return new Promise(function(resolve, reject) {
      jwt.sign( payload, secretKey, option, function(err, token) {
        if (err) reject(err);
        resolve(token);
      });
    });
  }
  
  function decodeAuthToken(token) {
    const secretKey = secret_key;
  
    return new Promise(function(resolve, reject) {
      jwt.verify(token, secretKey, function(err, decoded) {
        if (err)  reject(err);
        resolve(decoded);
      });
    });
  }


  module.exports = {
    generateAuthToken,
    decodeAuthToken
  }


