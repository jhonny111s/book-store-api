"use strict";

const Ajv = require('ajv');
const ajv = new Ajv({$data: true, allErrors: true, async: true});


const author = {
  "$async": true,
  "title": "author",
  "description": "A author schema",
  "type": "object",
  "properties": {
    "fullName": {
      "description": "The author name",
      "type": "string",
      "minLength": 5,
    },
    "birth": {
        "description": "birth's author",
        "type": "string",
    },
    "id": {
        "description": "author id",
        "type": "string",
        "pattern": "^([0-9]{4})", // example 0005
    },
    "country": {
        "description": "author's country",
        "type": "string",
    },
  },
  "required": ["id", "fullName", "birth", "country"]
};


function validateSchema( data, schema) {
    const validate = ajv.compile(schema);
    return new Promise(function(resolve, reject) {
        validate(data)
            .then((result) => {
                // Simula un tiempo de espera de 3 segundos
                setTimeout(function(){resolve(result); }, 3000);
                
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


module.exports = {
    validateSchema,
    author
}
