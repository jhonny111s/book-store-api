"use strict";

const express = require('express');
const router = express.Router();
const validation = require('../models/jsonschemas/author');


router.get('/', (req, res) => {
  const authors = author ;
  res.send(authors);
});

router.get('/:id', (req, res) => {
  const item = author.filter(author => author.id == req.params.id );
  if (item.length > 0) {
    return res.send(item[0]);
  }
  res.status(404).send({});
});

router.post('/', (req, res) => {
  validation.validateSchema(req.body, validation.author)
  .then(() => {
    author = author.concat(req.body);
    res.status(201).location(`api/authors/${req.body.id}`).send();
  })
  .catch((error) => {
    res.status(400).send(error);
  });
});

router.delete('/:id', (req, res) => {
  const item = author.filter(author => author.id == req.params.id );
  if (item.length > 0) {
    author = author.filter(author => author.id !== req.params.id );
    return res.send(item[0]);
  }
  res.status(404).send('Empty data');
});

router.patch('/:id', (req, res) => {
  const item = author.filter(author => author.id == req.params.id );
  if (item.length > 0) {

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
    author = author.map(bo => {
      if (bo.id == req.params.id) {
        return bo = diff;
      } 
      return bo;
    })
    return res.send(diff);
  }
  res.status(404).send();
});

router.put('/:id', (req, res) => {
  const item = author.filter(author => author.id == req.params.id );
  if (item.length > 0) {
    author = author.map(bo => {
      if (bo.id == req.params.id) {
        return bo = req.body;
      } 
      return bo;
    });

    return res.location(`api/authors/${req.params.id}`).send();
  }
  author = author.concat(req.body);
  res.status(201).location(`api/authors/${req.params.id}`).send();
});

module.exports = router; 