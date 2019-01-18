"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const { bookSchema, Book } = require('../models/jsonschemas/book');
const { Author } = require('../models/jsonschemas/author');
const mongodb = require("mongodb");

// Aqui agregamos los metodos
// https://www.rfc-archive.org/getrfc?rfc=2068

router.get('/', (req, res) => {
  // Se utiliza la agregación para hacer una consulta propia de mongo
  // con el lookup estamos reemplzando el id del author en el libro por su contenido.
  Book.aggregate([
    { "$lookup": {
      from: "authors", localField: "authors", foreignField: "_id", as: "authors"}
    }
  ])
  .exec(function (err, docs) {
    if (err) return res.status(500).send(err);
    res.status(200).send(docs);
  });
});

router.get('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Bad Request - Invalid Id');
  }

  Book.aggregate([
    {"$match": { _id: mongodb.ObjectID(req.params.id) }},
    { "$lookup": {
      from: "authors", localField: "authors", foreignField: "_id", as: "authors"}
    }
  ])
  .exec(function (err, doc) {
    if (err) return res.status(500).send(err);
    if (doc.length === 0) return res.status(404).send('Not Found');
    res.status(200).send(doc[0]);
  });
});

router.post('/', validate(bookSchema), (req, res) => {
  const book = new Book(req.body);
  book.save(function (err, doc) {
    if (err) return res.status(500).send(err);
    res.status(201).location(`api/books/${doc.id}`).send(doc);
  });
});

router.delete('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Bad Request - Invalid Id');
  }

  Book.findByIdAndDelete(req.params.id, function (err, doc) {
    if (err) return res.status(500).send(err);
    if (!doc) return res.status(404).send('Not Found');
    res.status(200).send(doc);
    // res.status(204).send(); // si no envia datos
  });
});

// Actualiza solo los campos enviados, si no existe el recurso devuelve un error
// https://www.rfc-archive.org/getrfc?rfc=5789
// https://www.rfc-archive.org/getrfc?rfc=7396
// https://www.rfc-archive.org/getrfc?rfc=6902
router.patch('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Bad Request - Invalid Id');
  }

  // Simula la funcionalidad del patch si un dato es enviado con valor se actualiza
  // si este es enviado null se remueve.
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

  // Para no complicarnos por el momento se va a hacer un set osea remplazar
  // los valores que mandamos, sin embargo esta es una aproximación muy simple de un patch.
  Book.findByIdAndUpdate(req.params.id, mergePatch(req.body) ,function (err, doc) {
    if (err) return res.status(500).send(err);
    if (!doc) return res.status(404).send('Not Found');
    res.status(200).send(doc);
  });
});

// Actualiza todo el recurso, si no existe se crea
router.put('/:id', validate(bookSchema), (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.status(400).send('Bad Request - Invalid Id');
  }

  Book.findByIdAndUpdate(req.params.id, req.body, {upsert:true} ,function (err, doc) {
    if (err) return res.status(500).send(err);
    if (!doc) return res.status(204).send();
    res.send(doc);
  });
});

module.exports = router; 