"use strict";

const authorSchema = {
  "$async": true,
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
    "id": {
        "description": "author id",
        "type": "string",
        "pattern": "^([0-9]{4})", // example 0005
    },
    "country": {
        "description": "author's country",
        "type": "string",
    },
  },
  "required": ["id", "fullName", "birth", "country"]
};

exports.authorSchema = authorSchema;
