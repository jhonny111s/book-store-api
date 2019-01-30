const { validateSchema } = require('../../../utils/validate');

describe('utils validate', () => {

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

    const data = {
        title: "test",
        authors: ["jim", "kraken"]
    };

    describe('VALIDATE SCHEMA', () => {
        it('valid data', () => {
            return expect(validateSchema(data, schema)).resolves.toBe(data);
        });

        it('invalid data', () => {
            delete data.title;
            return expect(validateSchema(data, schema)).rejects.toThrowError();
        });

        it('invalid schema', () => {
            delete data.title;
            return expect(validateSchema(data, "string")).rejects.toThrowError();
        });

        it('invalid data', () => {
            delete data.title;
            return expect(validateSchema("data", schema)).rejects.toThrowError();
        });
    
    });
});