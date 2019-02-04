const request = require('supertest');
const auth = require('../../../middleware/auth');
const express = require('express');
const { generateAuthToken } = require('../../../utils/token');
const { app }  = require('../../../index');


describe('middleware auth', () => {
    const router = express.Router();
    // simulate a route to test auth middleware
    router.get('/', auth, function(req, res) {
        res.status(200).json({ name: 'john' });
    });

    app.use("/testAuth", router);


    describe('AUTH', () => {
        let admin = { _id: 1, isAdmin: true, permissions: {}, accessName: null };
        let guest = { _id: 2, isAdmin: false, permissions: {}, accessName: "guest" };
        let user = { _id: 3, isAdmin: false, permissions: {"/testAuth": ["GET"]}, accessName: "user" };
        let tokens = [];
        
        beforeAll((done) => {
            Promise.all([generateAuthToken(admin),generateAuthToken(guest),generateAuthToken(user)]).then((auth) => {
                tokens = auth;
                done();
            });
        });

        it('it does not send token', () => {
            return request(app)
                    .get('/testAuth')
                    .set('Accept', 'application/json')
                    .expect(401)
                    .then(response => {
                        expect(response.text).toBe("Unauthorized - No token provided.");
                    })
        });

        it('invalid token', () => {
            return request(app)
                    .get('/testAuth')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', "invalid")
                    .expect(401)
                    .then(response => {
                        expect(response.text).toBe("Unauthorized - JsonWebTokenError: jwt malformed.");
                    })
        });

        it('valid admin token', () => {
            return request(app)
                    .get('/testAuth')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', tokens[0])
                    .expect(200)
                    .then(response => {
                        //expect(response.body).toMatchObject({"name": "john"});
                        expect(response.body).toMatchObject({"name": "john"});
                    })
        });

        it('without permissions', () => {
            return request(app)
                    .get('/testAuth')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', tokens[1])
                    .expect(403)
                    .then(response => {
                        expect(response.text).toBe("Forbidden");
                    })
        });

        it('user with permissions', () => {
            return request(app)
                    .get('/testAuth')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', tokens[2])
                    .expect(200)
                    .then(response => {
                        expect(response.body).toMatchObject({"name": "john"});
                    })
        });
    });

});