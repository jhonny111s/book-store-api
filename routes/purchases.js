"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');
const { purchaseSchema, Purchase } = require('../models/jsonschemas/purchase');
const mongodb = require("mongodb");

router.use(auth);

router.get('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) return res.generateResponse(400, null, 'Bad Request - Invalid Id');

  Purchase.findById(req.params.id, function (err, docs) {
    if (err) return res.generateResponse(500, null, err);
    if (!docs) return res.generateResponse(404, null, 'Not Found');
    return res.generateResponse(200, null, docs);
  });
});

router.post('/', validate(purchaseSchema), (req, res) => {

  function purchaseFormat(body) {
    let cart = {
      items: [],
      total: 0,
      size: 0,
      count: 0,
      state: 'INITIAL',
      user: body.user? body.user: null
    };

    if (Array.isArray(body.items)) {
      for (let item of body.items) {
        cart.items = cart.items.concat(item);
        cart.total += item.book.price * item.count;
        cart.size += 1;
        cart.count += item.count;
      }
    }
    return cart;
  }

  const purchase = new Purchase(purchaseFormat(req.body));
  purchase.save(function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    return res.location(`api/purchases/${doc.id}`).generateResponse(201, null, doc);
  });
});

router.delete('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) return res.generateResponse(400, null, 'Bad Request - Invalid Id');

  Purchase.findByIdAndDelete(req.params.id, function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    if (!doc) return res.generateResponse(404, null, 'Not Found');
    return res.generateResponse(200, null, doc);
  });
});

module.exports = router; 