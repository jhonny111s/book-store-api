"use strict";
const mongoose = require('mongoose');

// JsonSchema para validar lo que envia el cliente
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
  "required": ["title", "author", "description", "price", "code", "stock"]
};


const Book = mongoose.model('Books', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 2,
        trim: true,
        lowercase:true
        },
    author: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 144
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000
    },
    category: {
        type: String,
        enum: ['Novel', 'Poetry', 'Documental']
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true,
        minimum: 0,
    }
}));

exports.bookSchema = bookSchema;
exports.Book = Book;

