const mongoose = require('mongoose');

module.exports = function() {
  const url = 'mongodb://localhost:27017/library';
  console.log(url);
  mongoose.connect(url,
    { 
      "auth": {"authSource": "admin"},
      "user": 'admin',
      "pass": 'password',
  })
    .then(() => console.log(`Connect to ${url}`))
    .catch((err) => {
      console.log(err);
    });
}