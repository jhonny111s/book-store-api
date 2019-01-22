"use strict";

const mongoose = require('mongoose');

const accessSchema = {
  "title": "access",
  "description": "ACL",
  "type": "object",
  "properties": {
    "code": {
      "description": "unique Identifier",
      "type": "string",
      "minLength": 4,
    },
    "description": {
        "description": "ACL description",
        "type": "string",
    },
    "permissions": {
        "description": "array with object {route: ['GET]}",
        "type": "array",
        "minItems": 1,
    },
  },
  "required": ["code", "permissions"],
  "additionalProperties": false
};

const Access = mongoose.model('accesses', new mongoose.Schema({
  code: {
      type: String,
      required: true,
      minLength: 4,
      trim: true,
      lowercase:true,
      unique: true
      },
  description: {
      type: String,
  },
  permissions: {
      type: [Object],
      required: true
  }
}));

exports.accessSchema = accessSchema;
exports.Access = Access;

