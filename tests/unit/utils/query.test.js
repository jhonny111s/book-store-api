const query = require('../../../utils/query');
const mockingoose = require('mockingoose').default;
const { Author } = require('../../../models/jsonschemas/author');


describe('utils query', () => {
    const _doc = [
        {
            _id: '507f191e810c19729de860ea',
            fullName: "leon tostoi",
            birth: "09/08/1828",
            country: "rusia"
        },
        {
            _id: '507f191e810c19729de860e2',
            fullName: "fyodor dostoevsky",
            birth: "11/08/1821",
            country: "rusia"
        }
    ];

    

    beforeEach(() => {
        mockingoose.resetAll();
      })

    describe('FINDBYID', () => {

        it('should return the doc', () => {
            mockingoose.Authors.toReturn(_doc[0], 'findOne'); // findById is findOne

            return expect(query.findById(Author, _doc[0]._id)).resolves.toMatchObject({statusCode: 200});    
          })

          it('should return internal error', () => {
            mockingoose.Authors.toReturn(new Error('My Error'), 'findOne'); // findById is findOne

            return expect(query.findById(Author, '507f191e810c19729de860ea')).rejects.toThrowError();  
          })

          it('should return not found', () => {
            mockingoose.Authors.toReturn(null, 'findOne'); // findById is findOne

            return expect(query.findById(Author, '507f191e810c19729de860e2')).resolves.toMatchObject({statusCode: 404});
          })

          it('should return bad request', () => {
            return expect(query.findById(Author, 'string')).resolves.toMatchObject({statusCode: 400});
          })

    });

    describe('FIND', () => {

        it('should return all docs', () => {            
            mockingoose.Authors.toReturn(_doc, 'find');

            return query.find(Author).then((response) => {
                expect(response).toMatchObject({statusCode: 200});
                expect(response.message.length).toBe(2);
            })
          })

          it('should return docs by query', () => {            
            const myQuery = {fullName: 'leon tostoi'};
            const item = _doc.filter(item => item.fullName === myQuery.fullName);
            mockingoose.Authors.toReturn(item, 'find');

            return query.find(Author, query).then((response) => {
                expect(response).toMatchObject({statusCode: 200});
                expect(response.message.length).toBe(1);
            })
          })

          it('should return internal error', () => {
            mockingoose.Authors.toReturn(new Error('My Error'), 'find'); 

            return expect(query.find(Author)).rejects.toThrowError();
          })
    });

    describe('FINDALL', () => {

        it('should return all docs', () => {
            mockingoose.Authors.toReturn(_doc, 'find');

            return query.findAll(Author).then((response) => {
                expect(response).toMatchObject({statusCode: 200});
                expect(response.message.length).toBe(2);
            })
          })
    });

    describe('SAVE', () => {

        it('should save the doc', () => {
            mockingoose.Authors.toReturn(_doc[0], 'save');

            return expect(query.save(Author, _doc[0])).resolves.toMatchObject({statusCode: 201});    
          })

        it('should return internal error', () => {
        mockingoose.Authors.toReturn(new Error('My Error'), 'save'); 

        return expect(query.save(Author, _doc[0])).rejects.toThrowError();
        })
    })

    describe('REMOVE', () => {

        it('should remove the doc', () => {
            mockingoose.Authors.toReturn(_doc[0], 'findOneAndRemove');

            return expect(query.remove(Author, _doc[0]._id)).resolves.toMatchObject({statusCode: 200});    
          })
        
        it('should return not found', () => {
            mockingoose.Authors.toReturn(null, 'findOneAndRemove');

            return expect(query.remove(Author, '507f191e810c19729de860e2')).resolves.toMatchObject({statusCode: 404});
        })

        it('should return bad request', () => {
            return expect(query.remove(Author, 'string')).resolves.toMatchObject({statusCode: 400});
          })

        it('should return internal error', () => {
            mockingoose.Authors.toReturn(new Error('My Error'), 'findOneAndRemove'); 

            return expect(query.remove(Author, _doc[0]._id)).rejects.toThrowError();
        })
    })

    describe('PATCH', () => {

        it('should patch the doc', () => {
            mockingoose.Authors.toReturn(_doc[0], 'findOneAndUpdate');

            return expect(query.patch(Author, _doc[0]._id, _doc[0])).resolves.toMatchObject({statusCode: 200});    
          })
        
        it('should return not found', () => {
            mockingoose.Authors.toReturn(null, 'findOneAndUpdate');

            return expect(query.patch(Author, '507f191e810c19729de860e2', _doc[0])).resolves.toMatchObject({statusCode: 404});
        })

        it('should return bad request', () => {
            return expect(query.patch(Author, 'string', _doc[0])).resolves.toMatchObject({statusCode: 400});
          })

        it('should return internal error', () => {
            mockingoose.Authors.toReturn(new Error('My Error'), 'findOneAndUpdate'); 

            return expect(query.patch(Author, _doc[0]._id, _doc[0])).rejects.toThrowError();
        })
    })

    describe('PUT', () => {

        it('should update the doc', () => {
            mockingoose.Authors.toReturn(_doc[0], 'findOneAndUpdate');

            return expect(query.put(Author, _doc[0]._id, _doc[0])).resolves.toMatchObject({statusCode: 200});    
          })
        
        it('should create de doc', () => {
            mockingoose.Authors.toReturn(null, 'findOneAndUpdate');

            return expect(query.put(Author, '507f191e810c19729de860e2', _doc[0])).resolves.toMatchObject({statusCode: 204});
        })

        it('should return bad request', () => {
            return expect(query.put(Author, 'string')).resolves.toMatchObject({statusCode: 400});
          })

        it('should return internal error', () => {
            mockingoose.Authors.toReturn(new Error('My Error'), 'findOneAndUpdate'); 

            return expect(query.put(Author, _doc[0]._id, _doc[0])).rejects.toThrowError();
        })
    })

});