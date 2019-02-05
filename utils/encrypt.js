const bcrypt = require('bcrypt');


function generate(string, salt=10) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(salt).then((salt)=> {
            bcrypt.hash(string, salt).then((hash) => {
            return resolve(hash);
            })
            .catch((err) => {
                return reject(err);;
            });
        })
        .catch((err) => {
            return reject(err);
        });
  });
}
  
  function compare(string, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(string, hash)
            .then((valid)=>{
                return resolve(valid);
            })
            .catch((err) => {
                return reject(err);
            });
        })
        
  }


  module.exports = {
    generate,
    compare
  }


