"use strict";

const mongoose = require('mongoose');

const roleSchema = {
  "title": "role",
  "description": "type role",
  "type": "object",
  "properties": {
    "name": {
      "description": "The name",
      "type": "string",
      "minLength": 4,
    },
    "code": {
        "description": "code",
        "type": "number",
    },
    "accesess": {
        "description": "array of access ids",
        "type": "array",
        "minItems": 1,
        "items": {
            "type": 'string'
        } 
    },
  },
  "required": ["name", "code"],
  "additionalProperties": false
};

const Role = mongoose.model('roles', new mongoose.Schema({
  name: {
      type: String,
      required: true,
      minLength: 4,
      trim: true,
      lowercase:true
      },
  code: {
      type: Number,
      unique: true,
      required: true
  },
  accesess: {
      type: [String],
      default: "0002" // guest
  }
}));

exports.roleSchema = roleSchema;
exports.Role = Role;

