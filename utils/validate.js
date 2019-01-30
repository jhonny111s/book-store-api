const Ajv = require('ajv');
const ajv = new Ajv({$data: true, allErrors: true, async: true});


function validateSchema( data, schema) {
    return new Promise(function(resolve, reject) {
        try {
            schema["$async"] = true;
            const validate = ajv.compile(schema);
            validate(data)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err)
                });
        } catch (error) {
            reject(error)
        }

    });
}


  module.exports = {
    validateSchema
  }