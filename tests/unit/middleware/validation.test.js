const request = require('supertest');
const validate = require('../../../middleware/validation');
const express = require('express');
const { app }  = require('../../../index');


describe('middleware validation', () => {
    const schema = {
        "title": "test",
        "description": "A test schema",
        "type": "object",
        "properties": {
          "title": {
            "description": "The test title",
            "type": "string",
            "minLength": 2,
          },
          "authors": {
              "description": "reference to authors",
              "type": "array",
              "minItems": 1,
              "items": {
                  "type": "string"
              }
          }
        },
        "required": ["title", "authors"],
    };

    const router = express.Router();
    // simulate a route to test validation middleware
    router.post('/',  validate(schema), function(req, res) {
        return res.send(req.body);
    });

    app.use("/testValidation", router);

    describe('VALIDATION', () => {
        let data = {
            "title": "my book story",
            "authors": ["jack", "thomas"]
        };

        it('correct data format', () => {
            return request(app)
                    .post('/testValidation')
                    .send(data)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .then(response => {
                        expect(response.body).toMatchObject(data);
                    })
        });

        it('malformed data', () => {
            delete data.title;
            return request(app)
                    .post('/testValidation')
                    .send(data)
                    .set('Accept', 'application/json')
                    .expect(400)
                    .then(response => {
                        expect(response.text).toMatch("validation failed");
                    })
        });
    });

});