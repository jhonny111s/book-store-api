"use strict";

const express = require('express');
// const bodyParser = require('body-parser');
const books = require('../routes/books');

module.exports = function(app) {
  // Express usa los siguientes middleware que estan basados en body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use(bodyParser.json());  // to support JSON-encoded bodies
  // app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


  // Aqui creamos los recursos
  app.use('/api/books', books);
}