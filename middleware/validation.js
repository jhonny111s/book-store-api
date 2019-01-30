"use strict";

const { validateSchema } = require('../utils/validate');

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
