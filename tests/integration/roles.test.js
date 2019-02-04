const request = require('supertest');
const { app } = require('../../index');
const  { Role } = require('../../models/jsonschemas/role');
const { generateAuthToken } = require('../../utils/token');


describe('routes roles', () => {

    describe('ROLES', () => {
        let code = "";
        let role = {};
        let token = "";

        let server = null;

        beforeAll((done) => {
            generateAuthToken({ _id: 1, isAdmin: true, permissions: {}, accessName: null}).then((auth) => {
                token = auth;
                done();
            });
        });

        beforeEach((done) => {
            role = {
                "name": "guest",
                "code": 1
            };

            server = app.listen();
            Role.create(role).then((response) => {
                code = response.code;
                done();
            })
        });

        afterEach((done) => {
            Role.deleteMany({}).then((response) => {
                server.close();
                done(); 
            })
        });

        describe('GET', () => {
            it('get all roles', () => {
                return request(app)
                    .get('/api/roles')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect(200)
                    .then(response => {
                        expect(response.body.length).toBe(1);
                    })
            });

            it('get role by code', () => {
                return request(app)
                    .get('/api/roles/' + code)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect(200)
                    .then(response => {
                        expect(response.body.code).toBe(code);
                    })
            });

            it('Get role with no existent valid code', () => {
                return request(app)
                    .get('/api/roles/7')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /html/)
                    .expect(404)
                    .then(response => {
                        expect(response.text).toBe('Not Found');
                    })
            });

            it('Get author with invalid code', () => {
                return request(app)
                    .get('/api/roles/wrong')
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
            it('save role', () => {
                return request(app)
                    .post('/api/roles')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send({
                        "name": "guest",
                        "code": 5
                    })
                    .expect(201)
                    .then(response => {
                        expect(response.body).toMatchObject({name: "guest"});
                    })
            });

            it('save fails with validation error', () => {
                return request(app)
                    .post('/api/roles')
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
                    .delete('/api/roles/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });

            it('delete role with valid code', () => {
                return request(app)
                    .delete('/api/roles/'+ code)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body.code).toBe(code);
                    })
            });

            it('delete role with no existent valid code', () => {
                return request(app)
                    .delete('/api/roles/7')
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

            it('patch role with no exist valid code', () => {
                return request(app)
                    .patch('/api/roles/7')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(role)
                    .expect('Content-Type', /html/)
                    .expect(404)
                    .then(response => {
                        expect(response.text).toBe('Not Found');
                    })
            });

            it('patch role with invalid code', () => {
                return request(app)
                    .patch('/api/roles/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(role)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });

            it('patch role with valid code', () => {
                role.isAdmin = null;
                return request(app)
                    .patch('/api/roles/' + code)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(role)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body.code).toBe(code);
                    })
            });
        });

        describe('PUT', () => {

            it('put role with no exist valid code', () => {
                return request(app)
                    .put('/api/roles/3')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(role)
                    //.expect('Content-Type', /json/)
                    .expect(204)
                    .then(response => {
                        expect(response.body).toMatchObject({});
                    })
            });

            it('put role with invalid code', () => {
                return request(app)
                    .put('/api/roles/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(role)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });

            it('put role with valid code', () => {
                return request(app)
                    .put('/api/roles/' + code)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(role)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body.code).toBe(code);
                    })
            });
        });

    });

});