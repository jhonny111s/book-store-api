"use strict";

const Ajv = require('ajv');
const ajv = new Ajv({$data: true, allErrors: true, async: true});


function validateSchema( data, schema) {
    schema["$async"] = true;
    const validate = ajv.compile(schema);
    return new Promise(function(resolve, reject) {
        validate(data)
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                if (err instanceof Ajv.ValidationError)
                    reject(err)
                else {
                    reject(err)
                }
            });
    });
}


module.exports = function(schema) {
    return function(req, res, next) {
        validateSchema(req.body, schema)
        .then(() => {
            next();
        })
        .catch((error) => {
            res.status(400).send(error);
        }) 
      }
}
