const request = require('supertest');
const { app } = require('../../index');
const  { Purchase } = require('../../models/jsonschemas/purchase');
const { generateAuthToken } = require('../../utils/token');
const { purchaseFormat } = require('../../utils/util');


describe('routes purchases', () => {

    describe('PURCHASE', () => {
        let id = "";
        let purchase = {};
        let token = "";

        let server = null;

        beforeAll((done) => {
            generateAuthToken({ _id: 1, isAdmin: true, permissions: {}, accessName: null}).then((auth) => {
                token = auth;
                done();
            });
        });

        beforeEach((done) => {
            purchase = {
                "items": [{
                    "count": 0,
                    "book": {
                        "title": "Cien años de soledad",
                        "authors": ["Gabriel Garcia Marquez"],
                        "description": "El libro narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo",
                        "price": 60000,
                        "code": "0004",
                        "category": "Novel",
                        "stock": 3
                    }
                }]
            };

            server = app.listen();
            Purchase.create(purchaseFormat(purchase)).then((response) => {
                id = String(response._id);
                done();
            })
        });

        afterEach((done) => {
            Purchase.deleteMany({}).then((response) => {
                server.close();
                done(); 
            })
        });

        describe('GET', () => {
            it('get purchases by id', () => {
                return request(app)
                    .get('/api/purchases/' + id)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect(200)
                    .then(response => {
                        expect(response.body._id).toBe(id);
                    })
            });

            it('Get purchases with no existent valid id', () => {
                return request(app)
                    .get('/api/purchases/5c49fe2c07a39b36cea3d82e')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /html/)
                    .expect(404)
                    .then(response => {
                        expect(response.text).toBe('Not Found');
                    })
            });

            it('Get purchases with invalid id', () => {
                return request(app)
                    .get('/api/purchases/wrong')
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
            it('save purchases', () => {
                purchase.items[0].book.code = '0001';
                return request(app)
                    .post('/api/purchases')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .send(purchase)
                    .expect(201)
                    .then(response => {
                        expect(response.body.items[0].book).toMatchObject({code: "0001"});
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
            it('error delete purchases with invalid id', () => {
                return request(app)
                    .delete('/api/purchases/wrong')
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /html/)
                    .expect(400)
                    .then(response => {
                        expect(response.text).toBe('Bad Request - Invalid Id');
                    })
            });

            it('delete purchases with valid id', () => {
                return request(app)
                    .delete('/api/purchases/'+ id)
                    .set('Accept', 'application/json')
                    .set('x-auth-token', token)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(response => {
                        expect(response.body._id).toBe(id);
                    })
            });

            it('delete purchases with no existent valid id', () => {
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

    });

});