"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const { purchaseSchema, Purchase } = require('../models/jsonschemas/purchase');
const mongodb = require("mongodb");

router.get('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Invalid id');
  }

  Purchase.findById(req.params.id, function (err, docs) {
    if (err) return res.status(400).send(err);
    res.send(docs);
  });
});

router.post('/', validate(purchaseSchema), (req, res) => {

  function purchaseFormat(items) {
    let cart = {
      items: [],
      total: 0,
      size: 0,
      count: 0,
      state: 'INITIAL',
      user: null
    };

    if (Array.isArray(items)) {
      for (let item of items) {
        cart.items = cart.items.concat(item);
        cart.total += item.book.price * item.count;
        cart.size += 1;
        cart.count += item.count;
      }
    }
    return cart;
  }

  const purchase = new Purchase(purchaseFormat(req.body.items));
  purchase.save(function (err, doc) {
    if (err) return res.status(400).send(err);
    res.status(201).location(`api/purchases/${doc.id}`).send(doc);
  });
});

router.delete('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Invalid id');
  }

  Book.findByIdAndDelete(req.params.id, function (err, doc) {
    if (err) return res.status(400).send(err);
    res.send(doc);
  });
});

module.exports = router; 