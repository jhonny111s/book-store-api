const request = require('supertest');
const generateResponse = require('../../../middleware/response');
const express = require('express');


describe('middleware response', () => {
    const app = express();
    const router = express.Router();

    let statusCode = 200;
    let headers = null;
    let message = "";
    
    // simulate a route to test auth middleware
    router.get('/', generateResponse, function(req, res) {
    res.generateResponse(statusCode, headers, message);
    });

    app.use("/test", router);

    describe('RESPONSES', () => {

        afterEach(() => {
            statusCode = 200;
            headers = null;
            message = "";
        });

        it('return between 200 and 399 status code', () => {
            message = { name: 'john' };
            return request(app)
                    .get('/test')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .then(response => {
                        expect(response.body).toMatchObject(message);
                    })
        });

        it('return return headers', () => {
            headers = { 'x-auth-token': '123' };
            return request(app)
                    .get('/test')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .then(response => {
                        expect(response.header).toMatchObject(headers);
                    })
        });

        it('return between 400 and 499 status code', () => {
            statusCode = 400;
            message = 'Bad Request - Invalid Id';
            return request(app)
                    .get('/test')
                    .set('Accept', 'application/json')
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe(message);
                    })
        });

        it('return between 500 and 599 status code', () => {
            statusCode = 500;
            message = null;
            return request(app)
                    .get('/test')
                    .set('Accept', 'application/json')
                    .expect(500)
                    .then(response => {
                        expect(response.text).toBe("");
                    })
        });

       
    });

});