"use strict";

const express = require('express');
// const bodyParser = require('body-parser');
const books = require('../routes/books');
const authors = require('../routes/authors');
const purchases = require('../routes/purchases');
const users = require('../routes/users');
const roles = require('../routes/roles');
const accesses = require('../routes/accesses');

module.exports = function(app) {
  // Express usa los siguientes middleware que estan basados en body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use(bodyParser.json());  // to support JSON-encoded bodies
  // app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


  // Aqui creamos los recursos
  app.use('/api/books', books);
  app.use('/api/authors', authors);
  app.use('/api/purchases', purchases);
  app.use('/api/users', users);
  app.use('/api/roles', roles);
  app.use('/api/accesses', accesses);
}