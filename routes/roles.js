"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');
const { roleSchema, Role } = require('../models/jsonschemas/role');
const { mergePatch } = require('../utils/util');

router.use(auth);

router.get('/', (req, res) => {
    Role.find({}, function (err, roles) {
      if (err) return res.generateResponse(500, null, err);
      return res.generateResponse(200, null, roles);
    });
  });

router.get('/:code', (req, res) => {
  if (!req.params.code) return res.generateResponse(400, null, 'Bad Request - Invalid Id');

  Role.aggregate([
    {"$match": { code: parseInt(req.params.code) }},
    { "$lookup": {
      from: "accesses", localField: "accesses", foreignField: "code", as: "accesses"}
    }
  ])
  .exec(function (err, docs) {
    if (err) return res.generateResponse(500, null, err);
    return res.generateResponse(200, null, docs);
  });
});

router.post('/', validate(roleSchema), (req, res) => {
  const role = new Role(req.body);
  role.save(function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    return res.location(`api/roles/${doc.id}`).generateResponse(201, null, doc);
  });
});

router.delete('/:code', (req, res) => {
  if (!req.params.code) return res.generateResponse(400, null, 'Bad Request - Invalid Id');

  Role.findOneAndDelete({code: req.params.code}, function (err, doc) {
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

  // Para no complicarnos por el momento se va a hacer un set osea remplazar
  // los valores que mandamos, sin embargo esta es una aproximación muy simple de un patch.
  Role.findOneAndUpdate({code: req.params.code}, mergePatch(req.body) ,function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    if (!doc) return res.generateResponse(404, null, 'Not Found');
    return res.generateResponse(200, null, doc);
  });
});

// Actualiza todo el recurso, si no existe se crea
router.put('/:code', validate(roleSchema), (req, res) => {
  if (!req.params.code) return res.generateResponse(400, null, 'Bad Request - Invalid Id');

  Role.findOneAndUpdate({code: req.params.code}, req.body, {upsert:true} ,function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    if (!doc) return res.generateResponse(204);
    return res.generateResponse(200, null, doc);
  });
});

module.exports = router; 