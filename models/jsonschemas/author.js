"use strict";

const mongoose = require('mongoose');

const authorSchema = {
  "title": "author",
  "description": "A author schema",
  "type": "object",
  "properties": {
    "fullName": {
      "description": "The author name",
      "type": "string",
      "minLength": 5,
    },
    "birth": {
        "description": "birth's author",
        "type": "string",
    },
    "country": {
        "description": "author's country",
        "type": "string",
    },
  },
  "required": ["fullName", "birth", "country"]
};

const Author = mongoose.model('Authors', new mongoose.Schema({
  fullName: {
      type: String,
      required: true,
      minLength: 2,
      trim: true,
      lowercase:true
      },
  birth: {
      type: String,
      required: true
  },
  country: {
      type: String,
      required: true
  }
}));

exports.authorSchema = authorSchema;
exports.Author = Author;

