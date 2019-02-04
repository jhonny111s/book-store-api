const request = require('supertest');
const { app } = require('../../index');
const  { Access } = require('../../models/jsonschemas/access');
const { generateAuthToken } = require('../../utils/token');


describe('routes accesses', () => {

    describe('ACCESS', () => {
        let code = "";
        let token = "";

        let server = null;

        beforeAll((done) => {
            generateAuthToken({ _id: 1, isAdmin: true, permissions: {}, accessName: null}).then((auth) => {
                token = auth;
                done();
            });
        });

        beforeEach((done) => {
            access = {
                "code": "0002",
                "description": "book read",
                "permissions": [{
                    "/api/books": ["GET"]
                }]
            };

            server = app.listen();
            Access.create(access).then((response) => {
                code = response.code;
                done();
            })
        });

        afterEach((done) => {
            Access.deleteMany({}).then((response) => {
                server.close();
                done(); 
            })
        });

        describe('GET', () => {
            it('get all accesses', () => {
                return request(app)
                    .get('/api/accesses')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect(200)
                    .then(response => {
                        expect(response.body.length).toBe(1);
                    })
            });

            it('get access by code', () => {
                return request(app)
                    .get('/api/accesses/' + code)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect(200)
                    .then(response => {
                        expect(response.body.code).toBe(code);
                    })
            });

            it('Get access with no existent valid code', () => {
                return request(app)
                    .get('/api/accesses/7')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /html/)
                    .expect(404)
                    .then(response => {
                        expect(response.text).toBe('Not Found');
                    })
            });

            it('Get access with invalid code', () => {
                return request(app)
                    .get('/api/accesses/wrong')
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
            it('save access', () => {
                return request(app)
                    .post('/api/accesses')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send({
                        "code": "0001",
                        "description": "book write",
                        "permissions": [{
                            "/api/books": ["POST"]
                        }]
                      })
                    .expect(201)
                    .then(response => {
                        expect(response.body).toMatchObject({code: "0001"});
                    })
            });

            it('save fails with validation error', () => {
                return request(app)
                    .post('/api/accesses')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send({})
                    .expect('Content-Type', /json/)
                    .expect(400)
            });
        });

        describe('DELETE', () => {
            it('error delete access with invalid id', () => {
                return request(app)
                    .delete('/api/accesses/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });

            it('delete access with valid code', () => {
                return request(app)
                    .delete('/api/accesses/'+ code)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body.code).toBe(code);
                    })
            });

            it('delete access with no existent valid code', () => {
                return request(app)
                    .delete('/api/accesses/7')
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

            it('patch access with no exist valid code', () => {
                return request(app)
                    .patch('/api/accesses/7')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(access)
                    .expect('Content-Type', /html/)
                    .expect(404)
                    .then(response => {
                        expect(response.text).toBe('Not Found');
                    })
            });

            it('patch access with invalid code', () => {
                return request(app)
                    .patch('/api/accesses/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(access)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });

            it('patch access with valid code', () => {
                access.description = null;
                return request(app)
                    .patch('/api/accesses/' + code)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(access)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body.code).toBe(code);
                    })
            });
        });

        describe('PUT', () => {

            it('put access with no exist valid code', () => {
                return request(app)
                    .put('/api/accesses/3')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(access)
                    //.expect('Content-Type', /json/)
                    .expect(204)
                    .then(response => {
                        expect(response.body).toMatchObject({});
                    })
            });

            it('put access with invalid code', () => {
                return request(app)
                    .put('/api/accesses/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(access)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });

            it('put access with valid code', () => {
                return request(app)
                    .put('/api/accesses/' + code)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(access)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body.code).toBe(code);
                    })
            });
        });

    });

});