"use strict";

const mongoose = require('mongoose');

const userSchema = {
  "title": "user",
  "description": "A user schema",
  "type": "object",
  "properties": {
    "fullName": {
      "description": "The user full name",
      "type": "string",
      "minLength": 5,
    },
    "email": {
        "description": "user's email's author",
        "type": "string",
        "format": "email"
    },
    "password": {
        "description": "password",
        "type": "string"
    }
  },
  "required": ["fullName", "email", "password"],
  "additionalProperties": false
};

const User = mongoose.model('Users', new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minLength: 5,
        trim: true,
        lowercase:true
        },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 2 // guest
    }
  }));

exports.userSchema = userSchema;
exports.User = User;
