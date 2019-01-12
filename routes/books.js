"use strict";

const express = require('express');
const router = express.Router();

// Aqui agregamos los metodos
// https://www.rfc-archive.org/getrfc?rfc=2068

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
// https://www.rfc-archive.org/getrfc?rfc=5789
// https://www.rfc-archive.org/getrfc?rfc=7396
router.patch('/:id', (req, res) => {
  const item = book.filter(book => book.code == req.params.id );
  if (item.length > 0) {

    // función sugerida en la documentación
    function mergePatch(target, patch) {
      if (typeof(patch) === 'object') {
        if (typeof(target) !== 'object') {
          return {};
        }
        Object.keys(patch).forEach( key => {
          if (patch[key] === null) {
            if (target[key]) {
              delete target[key];
            }
          }
          else {
            target[key] = mergePatch(target[key], patch[key]);
          }
        });
        return target;
      }
      return patch;
    }

    const diff = mergePatch({...item[0]}, req.body);
    book = book.map(bo => {
      if (bo.code == req.body.code) {
        return bo = diff;
      } 
      return bo;
    })
    return res.send(diff);
  }
  res.status(404).send();
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