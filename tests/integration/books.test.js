const request = require('supertest');
const {app}  = require('../../index');
const  { Book } = require('../../models/jsonschemas/book');
const { generateAuthToken } = require('../../utils/token');


describe('routes books', () => {

    describe('Books', () => {
        let id = "";
        let book = {};
        let token = "";

        let server= null;

        beforeAll((done) => {
            generateAuthToken({ _id: 1, isAdmin: true, permissions: {}, accessName: null}).then((auth) => {
                token = auth;
                done();
            });
        });

        beforeEach((done) => {
            book = {
                "title": "Cien años de Soledad  ",
                "authors": ["5c49fe2c07a39b36cea3d82e"],
                "description": "El libro narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo",
                "price": 60000,
                "code": "0001",
                "category": "Novel",
                "stock": 2
            };

            server = app.listen();    
            Book.create(book).then((response) => {
                id = String(response._id);
                done();
            })
        });

        afterEach((done) => {
            Book.deleteMany({}).then((response) => {
                server.close();
                done(); 
            })
        });

        describe('GET', () => {
            it('get all books', () => {
                return request(app)
                    .get('/api/books')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect(200)
                    .then(response => {
                        expect(response.body.length).toBe(1);
                    })
            });

            it('get books by id', () => {
                return request(app)
                    .get('/api/books/' + id)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect(200)
                    .then(response => {
                        expect(response.body._id).toBe(id);
                    })
            });

            it('Get books with no existent valid id', () => {
                return request(app)
                    .get('/api/books/5c49fe2c07a39b36cea3d82e')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /html/)
                    .expect(404)
                    .then(response => {
                        expect(response.text).toBe('Not Found');
                    })
            });

            it('Get books with invalid id', () => {
                return request(app)
                    .get('/api/books/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });
        });

        describe('POST', () => {
            it('save book', () => {
                return request(app)
                    .post('/api/books')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send({
                        "title": "doctor sueño",
                        "authors": ["5c49fe2c07a39b36cea3d82e"],
                        "description": "Continuación del best-seller el resplandor",
                        "price": 90000,
                        "code": "0002",
                        "category": "Novel",
                        "stock": 20
                    })
                    .expect(201)
                    .then(response => {
                        expect(response.body).toMatchObject({title: "doctor sueño"});
                    })
            });

            it('save fails with validation error', () => {
                return request(app)
                    .post('/api/books')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send({})
                    .expect('Content-Type', /json/)
                    .expect(400)
            });
        });

        describe('DELETE', () => {
            it('error delete book with invalid id', () => {
                return request(app)
                    .delete('/api/books/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });

            it('delete book with valid id', () => {
                return request(app)
                    .delete('/api/books/'+ id)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body._id).toBe(id);
                    })
            });

            it('delete book with no existent valid id', () => {
                return request(app)
                    .delete('/api/books/5c49fe2c07a39b36cea3d82e')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /html/)
                    .expect(404)
                    .then(response => {
                        expect(response.text).toBe('Not Found');
                    })
            });
        });

        describe('PATCH', () => {

            it('patch book with no exist valid id', () => {
                return request(app)
                    .patch('/api/books/5c49fe2c07a39b36cea3d82e')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(book)
                    .expect('Content-Type', /html/)
                    .expect(404)
                    .then(response => {
                        expect(response.text).toBe('Not Found');
                    })
            });

            it('patch book with invalid id', () => {
                return request(app)
                    .patch('/api/books/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(book)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });

            it('patch book with valid id', () => {
                book.stock = null;
                return request(app)
                    .patch('/api/books/' + id)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(book)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body._id).toBe(id);
                    })
            });
        });

        describe('PUT', () => {

            it('put book with no exist valid id', () => {
                book.code = '0003';
                return request(app)
                    .put('/api/books/5c49fe2c07a39b36cea3d82e')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(book)
                    //.expect('Content-Type', /json/)
                    .expect(204)
                    .then(response => {
                        expect(response.body).toMatchObject({});
                    })
            });

            it('put book with invalid id', () => {
                return request(app)
                    .put('/api/books/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(book)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });

            it('put book with valid id', () => {
                return request(app)
                    .put('/api/books/' + id)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(book)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body._id).toBe(id);
                    })
            });
        });

    });

});