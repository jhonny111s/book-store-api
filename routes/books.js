"use strict";

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const books = book ;
  res.send(books);
});

router.get('/:id', (req, res) => {
  const item = book.filter(book => book.code == req.params.id );
  if (item.length > 0) {
    return res.send(item[0]);
  }
  res.status(404).send({});
});

router.post('/', (req, res) => {
  if (req.body && (Object.keys(req.body).length != 0)) {
    book = book.concat(req.body);
    return res.status(201).location(`api/books/${req.body.code}`).send();
  }
  res.status(404).send('Empty data');
});

router.delete('/:id', (req, res) => {
  const item = book.filter(book => book.code == req.params.id );
  if (item.length > 0) {
    book = book.filter(book => book.code !== req.params.id );
    return res.send(item[0]);
  }
  res.status(404).send('Empty data');
});

// Actualiza solo los campos enviados, si no existe el recurso devuelve un error
// https://tools.ietf.org/html/rfc7396
router.patch('/:id', (req, res) => {
  const item = book.filter(book => book.code == req.params.id );
  if (item.length > 0) {
    const resp = {...item[0]}
    Object.keys(req.body).forEach( elem => {
      if (req.body[elem] === null) {
        delete resp[elem];
      }
      else {
        resp[elem] = req.body[elem];
      }
    });

    book = book.map(bo => {
      if (bo.code == resp.code) {
        return bo = resp;
      } 
      return bo;
      
    });

    return res.send(resp);
  }
  res.status(404).send()
});

// Actualiza todo el recurso, si no existe se crea
router.put('/:id', (req, res) => {
  const item = book.filter(book => book.code == req.params.id );
  if (item.length > 0) {
    book = book.map(bo => {
      if (bo.code == req.body.code) {
        return bo = req.body;
      } 
      return bo;
    });

    return res.location(`api/books/${req.params.id}`).send();
  }
  book = book.concat(req.body);
  res.status(201).location(`api/books/${req.params.id}`).send();
});

module.exports = router; 