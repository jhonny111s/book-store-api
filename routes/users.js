"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const { userSchema, User } = require('../models/jsonschemas/user');
const bcrypt = require('bcrypt');
const uuid= require('uuid');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// Permite crear un usuario e inmediatamente generar el token de autenticación el la cabecera
router.post('/', validate(userSchema), async(req, res) => {
  // Con bcrypt lo que hacemos es encriptar nuestra contraseña, como esto toma tiempo
  // debemos aseguranos de que sea asincrono
  bcrypt.genSalt(10).then((salt)=> {
    bcrypt.hash(req.body.password, salt).then((hash) => {
      req.body.password = hash;
      
      const user = new User(req.body);
      user.save(function (err, doc) {
        if (err) return res.status(400).send(err);
        generateAuthToken(req.body.id)
        .then((token) => {
          res.header('x-auth-token', token).status(201).send();
        })
        .catch((err) => {
          res.status(500).send(err);
        }); 
      });
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
  en el localstorage.
 */
router.post('/login', async(req, res) => {
  User.findOne({email: req.body.email}, function (err, doc) {
    if (err) return res.status(400).send(err);
    if (!doc) return res.status(400).send('Invalid email or password');

    bcrypt.compare(req.body.password, doc.password)
    .then((valid)=>{
      if (!valid) {
        return res.status(400).send('Invalid email or password');
      }
  
      generateAuthToken(doc.id)
        .then((token) => {
          res.header('x-auth-token', token).send(_.pick(doc, ["id", "email"]));
        })
        .catch((err) => {
          res.status(500).send(err);
        }); 
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  });
});

// "Me" nos sirve para una vez autenticados obtener nuestros datos, es muy comun
// en redes sociales como facebook
router.post('/me', async(req, res) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  decodeAuthToken(token)
  .then((decoded)=> {
    User.findOne({_id: decoded._id}, function (err, doc) {
      if (err) return res.status(400).send(err);
      if (!doc) return res.status(400).send('user error');
      res.send(_.pick(doc, ["id", "email"]));
    });
  })
  .catch((err) => {
    res.status(400).send('Invalid token.' + err.name);
  });
});


function generateAuthToken(id) { 
  const payload = { _id: id, isAdmin: false};
  const option = { expiresIn: "120000" };
  const secretKey = 'privateKey';

  return new Promise(function(resolve, reject) {
    jwt.sign( payload, secretKey, option, function(err, token) {
      if (err) reject(err);
      resolve(token);
    });
  });
}

function decodeAuthToken(token) {
  const secretKey = 'privateKey';

  return new Promise(function(resolve, reject) {
    jwt.verify(token, secretKey, function(err, decoded) {
      if (err)  reject(err);
      resolve(decoded);
    });
  });
}

module.exports = router; 