"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');
const { bookSchema, Book } = require('../models/jsonschemas/book');
const mongodb = require("mongodb");
const { save, remove, patch, put } = require('../utils/query');


router.use(auth);
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
    if (err) return res.generateResponse(500, null, err);
    return res.generateResponse(200, null, docs);
  });
});

router.get('/:id', (req, res) => {
  if (!mongodb.ObjectID.isValid(req.params.id)) {
    return res.generateResponse(400, null, 'Bad Request - Invalid Id');
  }

  Book.aggregate([
    {"$match": { _id: mongodb.ObjectID(req.params.id) }},
    { "$lookup": {
      from: "authors", localField: "authors", foreignField: "_id", as: "authors"}
    }
  ])
  .exec(function (err, doc) {
    if (err) return res.generateResponse(500, null, err);
    if (doc.length === 0) return res.generateResponse(404, null, 'Not Found');
    return res.generateResponse(200, null, doc[0]);
  });
});

router.post('/', validate(bookSchema), (req, res) => {
  save(Book, req.body).then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

router.delete('/:id', (req, res) => {
  remove(Book, req.params.id).then((response) => {
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
router.patch('/:id', (req, res) => {
  patch(Book, req.params.id, req.body).then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

// Actualiza todo el recurso, si no existe se crea
router.put('/:id', validate(bookSchema), (req, res) => {
  put(Book, req.params.id, req.body).then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

module.exports = router; 