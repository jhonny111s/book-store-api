"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');
const { purchaseSchema, Purchase } = require('../models/jsonschemas/purchase');
const { findById, save, remove, patch, put } = require('../utils/query');
const { purchaseFormat } = require('../utils/util');

router.use(auth);

router.get('/:id', (req, res) => {
  findById(Purchase, req.params.id)
  .then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

router.post('/', validate(purchaseSchema), (req, res) => {
  save(Purchase, purchaseFormat(req.body)).then((response) => {
    return res.location(`api/purchases/${response.message.id}`).generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

router.delete('/:id', (req, res) => {
  remove(Purchase, {_id: req.params.id}).then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

module.exports = router; 