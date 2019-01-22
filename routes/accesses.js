"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const { accessSchema, Access } = require('../models/jsonschemas/access');

router.get('/', (req, res) => {
    Access.find({}, function (err, accesses) {
      if (err) return res.status(500).send(err);
      res.status(200).send(accesses);
    });
  });

router.get('/:code', (req, res) => {
  if (!req.params.code) {
    return res.status(400).send('Bad Request - Invalid Id');
  }

  Role.findOne({code: req.params.code}, function (err, role) {
    if (err) return res.status(500).send(err);
    if (!role) return res.status(404).send('Not Found');
    res.status(200).send(role);
  });
});

router.post('/', validate(accessSchema), (req, res) => {
  const access = new Access(req.body);
  access.save(function (err, doc) {
    if (err) return res.status(500).send(err);
    res.status(201).location(`api/access/${doc.id}`).send(doc);
  });
});

router.delete('/:code', (req, res) => {
  if (!req.params.code) {
    return res.status(400).send('Bad Request - Invalid Id');
  }

  access.findOneAndDelete({code: req.params.code}, function (err, doc) {
    if (err) return res.status(500).send(err);
    if (!doc) return res.status(404).send('Not Found');
    res.status(200).send(doc);
    // res.status(204).send(); // si no envia datos
  });
});

// Actualiza solo los campos enviados, si no existe el recurso devuelve un error
// https://www.rfc-archive.org/getrfc?rfc=5789
// https://www.rfc-archive.org/getrfc?rfc=7396
// https://www.rfc-archive.org/getrfc?rfc=6902
router.patch('/:code', (req, res) => {
  if (!req.params.code) {
    return res.status(400).send('Bad Request - Invalid Id');
  }

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
    if (err) return res.status(500).send(err);
    if (!doc) return res.status(404).send('Not Found');
    res.status(200).send(doc);
  });
});

// Actualiza todo el recurso, si no existe se crea
router.put('/:code', validate(accessSchema), (req, res) => {
  if (!req.params.code) {
    return res.status(400).send('Bad Request - Invalid Id');
  }

  Access.findOneAndUpdate({code: req.params.code}, req.body, {upsert:true} ,function (err, doc) {
    if (err) return res.status(500).send(err);
    if (!doc) return res.status(204).send();
    res.send(doc);
  });
});

module.exports = router; 