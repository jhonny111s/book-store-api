"use strict";

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
  "required": ["email", "password"],
  "additionalProperties": false
};

exports.userSchema = userSchema;
