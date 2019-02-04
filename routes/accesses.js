"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');
const { accessSchema, Access } = require('../models/jsonschemas/access');
const { mergePatch } = require('../utils/util');
const { findAll, findByConditions, save, remove, patch, put } = require('../utils/query');

router.use(auth);

router.get('/', (req, res) => {
  findAll(Access)
  .then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

router.get('/:code', (req, res) => {
  if (isNaN(req.params.code)) return res.generateResponse(400, null, 'Bad Request - Invalid Id');

  findByConditions(Access, {code: req.params.code})
  .then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

router.post('/', validate(accessSchema), (req, res) => {
  save(Access, req.body).then((response) => {
    return res.location(`api/roles/${response.message.id}`).generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

router.delete('/:code', (req, res) => {
  if (isNaN(req.params.code)) return res.generateResponse(400, null, 'Bad Request - Invalid Id');

  remove(Access, {code: req.params.code})
  .then((response) => {
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
  patch(Access, {code: req.params.code}, req.body).then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

// Actualiza todo el recurso, si no existe se crea
router.put('/:code', validate(accessSchema), (req, res) => {
  if (isNaN(req.params.code)) return res.generateResponse(400, null, 'Bad Request - Invalid Id');
  req.body.code = req.params.code;
  put(Access, {code: req.params.code}, req.body).then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

module.exports = router; 