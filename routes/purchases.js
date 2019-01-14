"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const { purchaseSchema } = require('../models/jsonschemas/purchase');

router.get('/:id', (req, res) => {
  const item = purchase.filter(purchase => purchase.id == req.params.id );
  if (item.length > 0) {
    return res.send(item[0]);
  }
  res.status(404).send({});
});

router.post('/', validate(purchaseSchema), (req, res) => {
  purchase = purchase.concat(req.body);
  res.status(201).location(`api/purchases/${req.body.id}`).send();
});

router.delete('/:id', (req, res) => {
  const item = purchase.filter(purchase => purchase.id == req.params.id );
  if (item.length > 0) {
    purchase = purchase.filter(purchase => purchase.id !== req.params.id );
    return res.send(item[0]);
  }
  res.status(404).send('Empty data');
});

module.exports = router; 