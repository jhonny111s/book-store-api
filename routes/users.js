"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const { userSchema } = require('../models/jsonschemas/user');

// Aqui agregamos los metodos
// https://www.rfc-archive.org/getrfc?rfc=2068


router.post('/', validate(userSchema), (req, res) => {
  user = user.concat(req.body);
  res.status(201).location(`api/books/${req.body.code}`).send();
});

module.exports = router; 