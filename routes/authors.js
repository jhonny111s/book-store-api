"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');
const { authorSchema, Author } = require('../models/jsonschemas/author');
const mongodb = require("mongodb");

// Se aplica el middleware de authorización a todos los metodos
router.use(auth);

router.get('/', (req, res) => {
  Author.find({}, function (err, authors) {
    if (err) return res.status(500).send(err);
    res.status(200).send(authors);
  });
});

router.get('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Bad Request - Invalid Id');
  }

  Author.findById(req.params.id, function (err, author) {
    if (err) return res.status(500).send(err);
    if (!author) return res.status(404).send('Not Found');
    res.status(200).send(author);
  });
});

router.post('/', validate(authorSchema), (req, res) => {
  const author = new Author(req.body);
  author.save(function (err, doc) {
    if (err) return res.status(500).send(err);
    res.status(201).location(`api/authors/${doc.id}`).send(doc);
  });
});

router.delete('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Bad Request - Invalid Id');
  }

  Author.findByIdAndDelete(req.params.id, function (err, doc) {
    if (err) return res.status(500).send(err);
    if (!doc) return res.status(404).send('Not Found');
    res.status(200).send(doc);
  });
});

router.patch('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Bad Request - Invalid Id');
  }

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

  Author.findByIdAndUpdate(req.params.id, mergePatch(req.body) ,function (err, doc) {
    if (err) return res.status(500).send(err);
    if (!author) return res.status(404).send('Not Found');
    res.status(200).send(doc);
  });
});

router.put('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Bad Request - Invalid Id');
  }

  Author.findByIdAndUpdate(req.params.id, req.body, {upsert:true} ,function (err, doc) {
    if (err) return res.status(500).send(err);
    if (!doc) return res.status(204).send();
    res.status(200).send(doc);
  });
});

module.exports = router; 