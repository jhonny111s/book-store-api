const request = require('supertest');
const { app } = require('../../index');
const  { Author } = require('../../models/jsonschemas/author');
const { generateAuthToken } = require('../../utils/token');


describe('routes authors', () => {

    describe('AUTHORS', () => {
        let id = "";
        let author = {};
        let token = "";

        let server = null;

        beforeAll((done) => {
            generateAuthToken({ _id: 1, isAdmin: true, permissions: {}, accessName: null}).then((auth) => {
                token = auth;
                done();
            });
        });

        beforeEach((done) => {
            author = {
                "fullName": "Gabriel Garcia Marquez",
                "birth": "1927-03-06",
                "country": "Colombia"
            };

            server = app.listen();
            Author.create(author).then((response) => {
                id = String(response._id);
                done();
            })
        });

        afterEach((done) => {
            Author.deleteMany({}).then((response) => {
                server.close();
                done(); 
            })
        });

        describe('GET', () => {
            it('get all authors', () => {
                return request(app)
                    .get('/api/authors')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect(200)
                    .then(response => {
                        expect(response.body.length).toBe(1);
                    })
            });

            it('get author by id', () => {
                return request(app)
                    .get('/api/authors/' + id)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect(200)
                    .then(response => {
                        expect(response.body._id).toBe(id);
                    })
            });

            it('Get author with no existent valid id', () => {
                return request(app)
                    .get('/api/authors/5c49fe2c07a39b36cea3d82e')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /html/)
                    .expect(404)
                    .then(response => {
                        expect(response.text).toBe('Not Found');
                    })
            });

            it('Get author with invalid id', () => {
                return request(app)
                    .get('/api/authors/wrong')
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
            it('save author', () => {
                return request(app)
                    .post('/api/authors')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send({
                        "fullName": "leon tostoi",
                        "birth": "09/08/1828",
                        "country": "rusia"
                    })
                    .expect(201)
                    .then(response => {
                        expect(response.body).toMatchObject({fullName: "leon tostoi"});
                    })
            });

            it('save fails with validation error', () => {
                return request(app)
                    .post('/api/authors')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send({})
                    .expect('Content-Type', /json/)
                    .expect(400)
            });
        });

        describe('DELETE', () => {
            it('error delete author with invalid id', () => {
                return request(app)
                    .delete('/api/authors/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });

            it('delete author with valid id', () => {
                return request(app)
                    .delete('/api/authors/'+ id)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body._id).toBe(id);
                    })
            });

            it('delete author with no existent valid id', () => {
                return request(app)
                    .delete('/api/authors/5c49fe2c07a39b36cea3d82e')
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

            it('patch author with no exist valid id', () => {
                return request(app)
                    .patch('/api/authors/5c49fe2c07a39b36cea3d82e')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(author)
                    .expect('Content-Type', /html/)
                    .expect(404)
                    .then(response => {
                        expect(response.text).toBe('Not Found');
                    })
            });

            it('patch author with invalid id', () => {
                return request(app)
                    .patch('/api/authors/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(author)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });

            it('patch author with valid id', () => {
                author.country = null;
                return request(app)
                    .patch('/api/authors/' + id)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(author)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body._id).toBe(id);
                    })
            });
        });

        describe('PUT', () => {

            it('put author with no exist valid id', () => {
                return request(app)
                    .put('/api/authors/5c49fe2c07a39b36cea3d82e')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(author)
                    //.expect('Content-Type', /json/)
                    .expect(204)
                    .then(response => {
                        expect(response.body).toMatchObject({});
                    })
            });

            it('put author with invalid id', () => {
                return request(app)
                    .put('/api/authors/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(author)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });

            it('put author with valid id', () => {
                return request(app)
                    .put('/api/authors/' + id)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(author)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body._id).toBe(id);
                    })
            });
        });

    });

});