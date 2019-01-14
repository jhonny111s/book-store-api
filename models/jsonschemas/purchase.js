"use strict";

const Ajv = require('ajv');
const ajv = new Ajv({$data: true, allErrors: true, async: true});


const { book } = require('./book');

const purchase = {
  "$async": true,
  "title": "purchase",
  "description": "purchase state",
  "type": "object",

  "definitions": {
    "book": book,
    "item": {
        "title": "item",
        "description": "item purchase",
        "type": "object",
        "properties": {
            "book": {
                "$ref": "#/definitions/book"
            },
            "count": {
              "description": "count item",
              "type": "number",
              "minimum": 0,
            }
        },
        "required":["book","count"]
    }
},
  "properties": {
    "items": {
        "type": "array",
        "minItems": 1,
        "items": {
            "$ref": "#/definitions/item"
        } 
    },
    "total": {
        "description": "sum of total items",
        "type": "number",
        "minimum": 0,
    },
    "size": {
        "description": "count items",
        "type": "number",
        "minimum": 0,
    },
    "state": {
        "description": "purchase current state",
        "type": "string",
        "enum": ["INIT", "PROCCESING", "DONE", "FAIL"]
    },
    "user": {
        "description": "user's purchase",
        "type": "string",
    },
    "id": {
        "description": "id purchase",
        "type": "string",
    },
  },
  "required": ["id", "items"]
};


function validateSchema( data, schema) {
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

module.exports = {
    validateSchema,
    purchase
}
