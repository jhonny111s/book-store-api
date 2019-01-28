"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');
const { authorSchema, Author } = require('../models/jsonschemas/author');
const mongodb = require("mongodb");
const { mergePatch } = require('../utils/util');

// Se aplica el middleware de authorización a todos los metodos
router.use(auth);

router.get('/', (req, res) => {
  Author.find({}, function (err, authors) {
    if (err) return res.generateResponse(500, null, err);
    return res.generateResponse(200, null, authors);
  });
});

router.get('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.generateResponse(400, null, 'Bad Request - Invalid Id');
  }

  Author.findById(req.params.id, function (err, author) {
    if (err) return res.generateResponse(500, null, err);
    if (!author) return res.generateResponse(404, null, 'Not Found');
    return res.generateResponse(200, null, author);
  });
});

router.post('/', validate(authorSchema), (req, res) => {
  const author = new Author(req.body);
  author.save(function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    return res.location(`api/authors/${doc.id}`).generateResponse(201, null, doc);
  });
});

router.delete('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.generateResponse(400, null, 'Bad Request - Invalid Id');
  }

  Author.findByIdAndDelete(req.params.id, function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    if (!doc) return res.generateResponse(404, null, 'Not Found');
    return res.generateResponse(200, null, doc);
  });
});

router.patch('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.generateResponse(400, null, 'Bad Request - Invalid Id');
  }

  Author.findByIdAndUpdate(req.params.id, mergePatch(req.body) ,function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    if (!author) return res.generateResponse(404, null, 'Not Found');
    return res.generateResponse(200, null, doc);
  });
});

router.put('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.generateResponse(400, null, 'Bad Request - Invalid Id');
  }

  Author.findByIdAndUpdate(req.params.id, req.body, {upsert:true} ,function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    if (!doc) return res.generateResponse(204);
    return res.generateResponse(200, null, doc);
  });
});

module.exports = router; 