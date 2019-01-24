"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');
const { accessSchema, Access } = require('../models/jsonschemas/access');

router.use(auth);

router.get('/', (req, res) => {
    Access.find({}, function (err, accesses) {
      if (err) return res.generateResponse(500, null, err);
      return res.generateResponse(200, null, accesses);
    });
  });

router.get('/:code', (req, res) => {
  if (!req.params.code) return res.generateResponse(400, null, 'Bad Request - Invalid Id');

  Role.findOne({code: req.params.code}, function (err, role) {
    if (err) return res.generateResponse(500, null, err);
    if (!role) return res.generateResponse(404, null, 'Not Found');
    return res.generateResponse(200, null, role);
  });
});

router.post('/', validate(accessSchema), (req, res) => {
  const access = new Access(req.body);
  access.save(function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    return res.location(`api/access/${doc.id}`).generateResponse(201, null, doc);
  });
});

router.delete('/:code', (req, res) => {
  if (!req.params.code) return res.generateResponse(400, null, 'Bad Request - Invalid Id');

  access.findOneAndDelete({code: req.params.code}, function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    if (!doc) return res.generateResponse(404, null, 'Not Found');
    return res.generateResponse(200, null, doc);
    // res.status(204).send(); // si no envia datos
  });
});

// Actualiza solo los campos enviados, si no existe el recurso devuelve un error
// https://www.rfc-archive.org/getrfc?rfc=5789
// https://www.rfc-archive.org/getrfc?rfc=7396
// https://www.rfc-archive.org/getrfc?rfc=6902
router.patch('/:code', (req, res) => {
  if (!req.params.code) return res.generateResponse(400, null, 'Bad Request - Invalid Id');

  // Simula la funcionalidad del patch si un dato es enviado con valor se actualiza
  // si este es enviado null se remueve.
  function mergePatch(patch) {
    const update = {"$set": {}, "$unset": {}};
    if (typeof(patch) !== 'object') return patch;

    for (let item in patch) {
      if (patch[item] === null) {
        update["$unset"][item] = patch[item];
      }
      else {
        update["$set"][item] = patch[item];
      }
    }

    if (Object.keys(update["$set"]).length === 0) delete update["$set"];
    if (Object.keys(update["$unset"]).length === 0) delete update["$unset"];
    return update;
  }

  // Para no complicarnos por el momento se va a hacer un set osea remplazar
  // los valores que mandamos, sin embargo esta es una aproximación muy simple de un patch.
  Access.findOneAndUpdate({code: req.params.code}, mergePatch(req.body) ,function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    if (!doc) return res.generateResponse(404, null, 'Not Found');
    return res.generateResponse(200, null, doc);
  });
});

// Actualiza todo el recurso, si no existe se crea
router.put('/:code', validate(accessSchema), (req, res) => {
  if (!req.params.code) return res.generateResponse(400, null, 'Bad Request - Invalid Id');

  Access.findOneAndUpdate({code: req.params.code}, req.body, {upsert:true} ,function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    if (!doc) return res.generateResponse(204);
    return res.generateResponse(200, null, doc);
  });
});

module.exports = router; 