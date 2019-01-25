const {generateAuthToken, decodeAuthToken} = require('../../../utils/token');

describe('utils token', () => {
    let mainToken = "";
    const payload = { _id: '507f191e810c19729de860ea', isAdmin: true, permissions: {}, accessName: null};

    beforeEach((done) => {
        generateAuthToken(payload).then ((token) => {
            mainToken = token;
            done();
        });
    });

    it('should genarate aunth token with JWT', () => {
        return expect(generateAuthToken(payload)).resolves.toBe(mainToken);
    });

    it('error genarating aunth token with JWT', () => {
        return expect(generateAuthToken('string')).rejects.toThrow();
    });

    it('should decode auth token', () => {
        return expect(decodeAuthToken(mainToken)).resolves.toMatchObject({_id: payload._id, isAdmin: payload.isAdmin, permissions: payload.permissions});
    });

    it('error decoding malformed aunth token', () => {
        return expect(decodeAuthToken("malformed")).rejects.toThrow();
    });

    it('error decoding invalida token with wrong secret key', () => {
        const wrongToken= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U";
        return expect(decodeAuthToken(wrongToken)).rejects.toThrow();
    });
});