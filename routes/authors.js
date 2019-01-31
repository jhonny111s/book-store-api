"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');
const { authorSchema, Author } = require('../models/jsonschemas/author');
const { findAll, findById, save, remove, patch, put } = require('../utils/query');


// Se aplica el middleware de authorización a todos los metodos
router.use(auth);

router.get('/', (req, res) => {
  findAll(Author)
    .then((response) => {
      return res.generateResponse(response.statusCode, null, response.message);
    })
    .catch((error) => {
      return res.generateResponse(500, null, error);
    });
});

router.get('/:id', (req, res) => {
  findById(Author, req.params.id).then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

router.post('/', validate(authorSchema), (req, res) => {
  save(Author, req.body).then((response) => {
    return res.location(`api/authors/${response.message.id}`).generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

router.delete('/:id', (req, res) => {
  remove(Author, req.params.id).then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

router.patch('/:id', (req, res) => {
  patch(Author, req.params.id, req.body).then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

router.put('/:id', (req, res) => {
  put(Author, req.params.id, req.body).then((response) => {
    return res.generateResponse(response.statusCode, null, response.message);
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  });
});

module.exports = router; 