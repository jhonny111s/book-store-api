const {generateAuthToken, decodeAuthToken} = require('../../../utils/token');

describe('utils token', () => {
    let mainToken = "";
    let payload = {};

    beforeEach((done) => {
        payload = { _id: '507f191e810c19729de860ea', isAdmin: true, permissions: {}, accessName: null };
        generateAuthToken(payload).then ((token) => {
            mainToken = token;
            done();
        });
    });

    describe('generateAuthToken', () => {
        it('should genarate token with JWT', () => {
            return expect(generateAuthToken(payload)).resolves.toBe(mainToken);
        });
    
        it('error genarating token with JWT', () => {
            return expect(generateAuthToken('string')).rejects.toThrow();
        });
    });

    describe('decodeAuthToken', () => {
        it('should decode token', () => {
            return expect(decodeAuthToken(mainToken)).resolves.toMatchObject({_id: payload._id, isAdmin: payload.isAdmin, permissions: payload.permissions});
        });
    
        it('error decoding malformed token', () => {
            return expect(decodeAuthToken("malformed")).rejects.toThrow();
        });
    
        it('error decoding valid token with wrong secret key', () => {
            const wrongToken= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U";
            return expect(decodeAuthToken(wrongToken)).rejects.toThrow();
        });
    });
});