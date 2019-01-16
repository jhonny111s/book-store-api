"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const { authorSchema, Author } = require('../models/jsonschemas/author');
const mongodb = require("mongodb");


router.get('/', (req, res) => {
  Author.find({}, function (err, authors) {
    if (err) return res.status(400).send(err);
    res.send(authors);
  });
});

router.get('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Invalid id');
  }

  Author.findById(req.params.id, function (err, author) {
    if (err) return res.status(400).send(err);
    res.send(author);
  });
});

router.post('/', validate(authorSchema), (req, res) => {
  const author = new Author(req.body);
  author.save(function (err, doc) {
    if (err) return res.status(400).send(err);
    res.status(201).location(`api/authors/${doc.id}`).send(doc);
  });
});

router.delete('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Invalid id');
  }

  Author.findByIdAndDelete(req.params.id, function (err, doc) {
    if (err) return res.status(400).send(err);
    res.send(doc);
  });
});

router.patch('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Invalid id');
  }

  Author.findByIdAndUpdate(req.params.id, {$set: req.body } ,function (err, doc) {
    if (err) return res.status(400).send(err);
    res.send(doc);
  });
});

router.put('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Invalid id');
  }

  Author.findByIdAndUpdate(req.params.id, req.body, {upsert:true} ,function (err, doc) {
    if (err) return res.status(400).send(err);
    res.send(doc);
  });
});

module.exports = router; 