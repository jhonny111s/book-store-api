"use strict";

const bookSchema = {
  "title": "book",
  "description": "A book schema",
  "type": "object",
  "properties": {
    "title": {
      "description": "The book title",
      "type": "string",
      "minLength": 2,
    },
    "author": {
        "description": "reference to authors",
        "type": "array",
        "minItems": 1,
        "items": {
            "type": "string"
        }
    },
    "description": {
        "description": "book's description",
        "type": "string",
        "maxLength": 144
    },
    "price": {
        "description": "price in CO currency",
         "type": "number",
         "minimum": 0,
         "maximum": 1000000,
        },
    "code": {
        "description": "book id",
        "type": "string",
        "pattern": "^([0-9]{4})", // example 0005
    },
    "category": {
        "description": "The book category",
        "type": "string",
        "enum": ["Novel", "Poetry", "Documental"]
    },
    "stock": {
        "description": "number of books to sell",
         "type": "number",
         "minimum": 0,
         }
  },
  "required": ["title","stock", "code"]
};

exports.bookSchema = bookSchema;
