"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const { userSchema } = require('../models/jsonschemas/user');
const bcrypt = require('bcrypt');
const uuid= require('uuid');

router.post('/', validate(userSchema), async(req, res) => {
  // Con bcrypt lo que hacemos es encriptar nuestra contraseña, como esto toma tiempo
  // debemos aseguranos de que sea asincrono
  bcrypt.genSalt(10).then((salt)=> {
    bcrypt.hash(req.body.password, salt).then((hash) => {
      req.body.password = hash;
      req.body.id = uuid();
      user = user.concat(req.body);
      res.status(201).send();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

/* 
  para loguearnos primero debemos autenticarnos, lo que significa que mi email 
  y contraseña son validos.

  Como el cliente al loguearse debe recibir unos datos que nos identifiquen
  para asi posteriormente hacer nuevas peticiones, sin tener que volver a proveer estos
  datos, vamos a enviar un token el cual podra ser guardado en las cookies del navegador o
  en el localstorage, por el momento solo enviamos un true.
 */
router.post('/login', validate(userSchema), async(req, res) => {
  const item = user.filter(user => user.email == req.body.email );
  if (item.length === 0) {
    return res.status(400).send('Invalid email or password');
  }

  bcrypt.compare(req.body.password, item[0].password).then((valid)=>{
    if (!valid) {
      return res.status(400).send('Invalid email or password');
    }
    res.send(true);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
  
});

module.exports = router; 