"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');
const { roleSchema, Role } = require('../models/jsonschemas/role');
const { findAll, save, remove, patch, put } = require('../utils/query');

router.use(auth);

router.get('/', (req, res) => {
    findAll(Role)
    .then((response) => {
      return res.generateResponse(response.statusCode, null, response.message);
    })
    .catch((error) => {
      return res.generateResponse(500, null, error);
    });
  });

router.get('/:code', (req, res) => {
  if (isNaN(req.params.code)) return res.generateResponse(400, null, 'Bad Request - Invalid Id');

  Role.aggregate([
    {"$match": { code: parseInt(req.params.code) }},
    { "$lookup": {
      from: "accesses", localField: "accesses", foreignField: "code", as: "accesses"}
    }
  ])
  .exec(function (err, docs) {
    if (err) return res.generateResponse(500, null, err);
    if (docs.length == 0) return res.generateResponse(404, null, 'Not Found');
    return res.generateResponse(200, null, docs[0]);
  });
});

router.post('/', validate(roleSchema), (req, res) => {
  save(Role, req.body).then((response) => {
    return res.location(`api/roles/${response.message.id}`).generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

router.delete('/:code', (req, res) => {
  if (isNaN(req.params.code)) return res.generateResponse(400, null, 'Bad Request - Invalid Id');
  remove(Role, {code: req.params.code}).then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

// Actualiza solo los campos enviados, si no existe el recurso devuelve un error
// https://www.rfc-archive.org/getrfc?rfc=5789
// https://www.rfc-archive.org/getrfc?rfc=7396
// https://www.rfc-archive.org/getrfc?rfc=6902
router.patch('/:code', (req, res) => {
  if (isNaN(req.params.code)) return res.generateResponse(400, null, 'Bad Request - Invalid Id');
  patch(Role, {code: req.params.code}, req.body).then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

// Actualiza todo el recurso, si no existe se crea
router.put('/:code', validate(roleSchema), (req, res) => {
  if (isNaN(req.params.code)) return res.generateResponse(400, null, 'Bad Request - Invalid Id');
  req.body.code = req.params.code;
  put(Role, {code: req.params.code}, req.body).then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

module.exports = router; 