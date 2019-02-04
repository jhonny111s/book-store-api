const request = require('supertest');
const { app } = require('../../index');
const  { User } = require('../../models/jsonschemas/user');
const { generateAuthToken, decodeAuthToken } = require('../../utils/token');
const encrypt = require('../../utils/encrypt');


describe('routes users', () => {

    describe('USER', () => {
        let id = "";
        let user = {};
        let token = [];

        let server = null;


        beforeAll((done) => {
            generateAuthToken({ _id: '5c49fe2c07a39b36cea3d825', isAdmin: false, permissions: {}, accessName: null}).then((auth) => {
                token = token.concat(auth);
                done();
            });
        });

        beforeEach((done) => {
            server = app.listen();
            user = {
                "email": "myuser@example.com",
                "password": "myweekpass",
                "fullName": "I user"
              };

            encrypt.generate(user.password).then((hash) => {
                const newUser = {...user, password: hash};
                User.create(newUser).then((response) => {
                    id = String(response._id);
                    const payload = { _id: id, isAdmin: true, permissions: {}, accessName: null};
                    generateAuthToken(payload).then((auth) =>  {
                        token = token.concat(auth);
                        done();
                    })
                })
            })
        });

        afterEach((done) => {
            User.deleteMany({}).then((response) => {
                token = token.slice(0, -1);
                server.close();
                done(); 
            })
        });


        describe('POST', () => {
            it('save new user', () => {
                user.email = 'anotheruser@example.com';
                return request(app)
                    .post('/api/users')
                    .set('Accept', 'application/json')
                    .send(user)
                    .expect(201)
                    .then(response => {
                        expect(decodeAuthToken(response.header['x-auth-token'])).resolves.toBeDefined();
                    })
            });

            it('try save exist user', () => {
                return request(app)
                    .post('/api/users')
                    .set('Accept', 'application/json')
                    .send(user)
                    .expect(200)
                    .then(response => {
                        expect(response.text).toBe('user already registred. Please use login');
                    })
            });

            it('save fails with validation error', () => {
                return request(app)
                    .post('/api/users')
                    .set('Accept', 'application/json')
                    .send({})
                    .expect('Content-Type', /json/)
                    .expect(400)
            });


            it('should login user', () => {
                return request(app)
                    .post('/api/users/login')
                    .set('Accept', 'application/json')
                    .send(user)
                    .expect(200)
                    .then(response => {
                        expect(response.body.id).toBe(id);
                    })
            });

            it('should return error invalid user', () => {
                user.email = "anonymous@example.com";
                return request(app)
                    .post('/api/users/login')
                    .set('Accept', 'application/json')
                    .send(user)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe("Bad Request - Invalid email or password");
                    })
            });

            it('should return error invalid password', () => {
                user.password= "123";
                return request(app)
                    .post('/api/users/login')
                    .set('Accept', 'application/json')
                    .send(user)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe("Bad Request - Invalid email or password");
                    })
            });
        });

        describe('me', () => {
            it('should retun data', () => { 
                return request(app)
                    .post('/api/users/me')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token[1])
                    .send({})
                    .expect(200)
                    .then(response => {
                        expect(response.body.id).toBe(id);
                    })
            });

            it('should return error user does not exist', () => { 
                return request(app)
                    .post('/api/users/me')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token[0])
                    .send({})
                    .expect(404)
                    .then(response => {
                        expect(response.text).toBe("Not Found");
                    })
            });

            it('should return unauthorized- no token provided', () => {
                return request(app)
                    .post('/api/users/me')
                    .set('Accept', 'application/json')
                    .send({})
                    .expect(401)
                    .then(response => {
                        expect(response.text).toBe('Unauthorized - No token provided.');
                    })
            });

        });

    });

});