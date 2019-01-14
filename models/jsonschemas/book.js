"use strict";

/* 
    En este archivo debería solo existir el schema que representa la estructura
    y restricciones de "book", sin embargo tambien se esta agregando la validación en
    este archivo mientras aprendemos a hacer un middleware.
*/
const Ajv = require('ajv');
const ajv = new Ajv({$data: true, allErrors: true, async: true});

// https://json-schema.org/understanding-json-schema/index.html
/*
    Si bien jsonSchema puede no ser muy facil de entender en un principio como lo puede ser
    JOI, este nos brinda gran maniobrabilidad al ordenar la estructura y al definir toda clase
    de reglas que consideremos: tales como que un titulo debe tener mas de 2 caracteres o cosas
    más complejas como si se envia precio debe se obligatorio enviar stock.

*/
const book = {
  "title": "book",
  "description": "A book schema",
  "type": "object",
  "properties": {
    "title": {
      "description": "The book title",
      "type": "string",
      "minLength": 2,
    },
    "author": {
        "description": "reference to authors",
        "type": "array",
        "minItems": 1,
        "items": {
            "type": "string"
        }
    },
    "description": {
        "description": "book's description",
        "type": "string",
        "maxLength": 144
    },
    "price": {
        "description": "price in CO currency",
         "type": "number",
         "minimum": 0,
         "maximum": 1000000,
        },
    "code": {
        "description": "book id",
        "type": "string",
        "pattern": "^([0-9]{4})", // example 0005
    },
    "category": {
        "description": "The book category",
        "type": "string",
        "enum": ["Novel", "Poetry", "Documental"]
    },
    "stock": {
        "description": "number of books to sell",
         "type": "number",
         "minimum": 0,
         }
  },
  "required": ["title","stock", "code"]
};


function validateSchema( data, schema) {
    schema["$async"] = true;
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
    book
}
