"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const { bookSchema, Book } = require('../models/jsonschemas/book');
const mongodb = require("mongodb");

// Aqui agregamos los metodos
// https://www.rfc-archive.org/getrfc?rfc=2068

router.get('/', (req, res) => {
  Book.find({}, function (err, docs) {
    if (err) return res.status(400).send(err);
    res.send(docs);
  });
});

router.get('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Invalid id');
  }

  Book.findById(req.params.id, function (err, doc) {
    if (err) return res.status(400).send(err);
    res.send(doc);
  });
});

router.post('/', validate(bookSchema), (req, res) => {
  const book = new Book(req.body);
  book.save(function (err, doc) {
    if (err) return res.status(400).send(err);
    res.status(201).location(`api/books/${doc.id}`).send(doc);
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

// Actualiza solo los campos enviados, si no existe el recurso devuelve un error
// https://www.rfc-archive.org/getrfc?rfc=5789
// https://www.rfc-archive.org/getrfc?rfc=7396
// https://www.rfc-archive.org/getrfc?rfc=6902
router.patch('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Invalid id');
  }

  // Para no complicarnos por el momento se va a hacer un set osea remplazar
  // los valores que mandamos, sin embargo esta es una aproximación muy simple de un patch.
  Book.findByIdAndUpdate(req.params.id, {$set: req.body } ,function (err, doc) {
    if (err) return res.status(400).send(err);
    res.send(doc);
  });
});

// Actualiza todo el recurso, si no existe se crea
router.put('/:id', validate(bookSchema), (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Invalid id');
  }

  Book.findByIdAndUpdate(req.params.id, req.body, {upsert:true} ,function (err, doc) {
    if (err) return res.status(400).send(err);
    res.send(doc);
  });
});

module.exports = router; 