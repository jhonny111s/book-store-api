"use strict";

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');
const { userSchema, User } = require('../models/jsonschemas/user');
const { Role } = require('../models/jsonschemas/role');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const logger = require('../startup/logger');
const { generateAuthToken, decodeAuthToken } = require('../utils/token');
const { formatPermissions } = require('../utils/util');
const encrypt = require('../utils/encrypt');

const { findByConditions, save } = require('../utils/query');

// Permite crear un usuario e inmediatamente generar el token de autenticación el la cabecera
router.post('/', validate(userSchema), (req, res) => {
  findByConditions(User, {email: req.body.email})
  .then((user) => {
    // user exists then query return statusCode and message, save is 200 or error.
    if (user.statusCode == 200) return res.generateResponse(user.statusCode, null, 'user already registred. Please use login');

    let doc = {};
    encrypt.generate(req.body.password)
      .then((hash) => {
        req.body.password = hash;
        // save user with hash password
        return save(User, req.body);
        })
      .then((created) => {
        doc = created.message;
        // get permissions from user created
        return getPermissions(doc.role);
      })
      .then((acl) => {
        const payload = { _id: doc.id, isAdmin: acl.isAdmin, permissions: acl.acl, accessName: acl.name};
        // generate token with user and acl
        return generateAuthToken(payload);
      })
      .then((token) => {
        return res.generateResponse(201, {'x-auth-token': token}, null);
      })
      .catch((error) => {
        return res.generateResponse(500, null, error);
      })
  })
  .catch((error) => {
    return res.generateResponse(500, null, error);
  })
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
    if (err) return res.generateResponse(500, null, err);
    if (!doc) return res.generateResponse(400, null, 'Bad Request - Invalid email or password');
    bcrypt.compare(req.body.password, doc.password)
    .then((valid)=>{
      if (!valid) {
        return res.generateResponse(400, null, 'Bad Request - Invalid email or password');
      }

      getPermissions(doc.role).then((acl)=> {
        const payload = { _id: doc.id, isAdmin: acl.isAdmin, permissions: acl.acl, accessName: acl.name};
        generateAuthToken(payload)
        .then((token) => {
          return res.generateResponse(200, {'x-auth-token': token}, _.pick(doc, ["id", "email"]));
        })
        .catch((err) => {
          return res.generateResponse(500, null, err);
        }); 
      })
      .catch((err) => {
        return res.generateResponse(500, null, err);
      });
    })
    .catch((err) => {
      return res.generateResponse(500, null, err);
    });
  });
});

// "Me" nos sirve para una vez autenticados obtener nuestros datos, es muy comun
// en redes sociales como facebook
router.post('/me', async(req, res) => {
  const token = req.header('x-auth-token');
  if (!token) return res.generateResponse(401, null, 'Unauthorized - No token provided.');

  decodeAuthToken(token)
  .then((decoded) => { 
    // find user by id
    return findByConditions(User, {_id: decoded._id})
      .then((doc) => {
        // check error in find or send response
        if (doc.statusCode !== 200) return res.generateResponse(doc.statusCode, null, 'Not Found');
        return res.status(200).send(_.pick(doc.message, ["id", "email"]));
      })
      .catch((err) => {
        return res.generateResponse(500, null, err);
      })
    })
  .catch((err) => {
    return res.generateResponse(401, null, `Unauthorized - ${err.name}.`);
  });
});

function getPermissions(role){
  return new Promise(function(resolve, reject) {
    Role.aggregate([
      {"$match": { code: parseInt(role) }},
      { "$lookup": {
        from: "accesses", localField: "accesses", foreignField: "code", as: "accesses"}
      }
    ])
    .exec(function (err, docs) {
      if (err) reject(err);
      // el role no existe, se maneja como un rol sin permisos
      if (docs.length === 0) {
        logger.warn(`Rol ${role} does not exist`);
        resolve({name: null, acl:{}, isAdmin: false });
      }
      else {
        resolve({name: docs[0].name, acl:formatPermissions(docs[0].accesses), isAdmin: docs[0].isAdmin });
      }  
    });
  });
}

module.exports = router; 