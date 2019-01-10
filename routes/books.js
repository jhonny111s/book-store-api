"use strict";

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const books = [{titile: "aquiles"}, {titile: "homero"}] ;
  res.send(books);
});

module.exports = router; 