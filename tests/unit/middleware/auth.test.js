const {generateAuthToken, decodeAuthToken} = require('../../../utils/token');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('utils', () => {
  it('should genarate aunth token with JWT', (done) => {
    const user = { 
      id: '507f191e810c19729de860ea', 
    };
    const acl = {
        isAdmin: true,
        aclName: null,
        acl: {}
    };

    generateAuthToken(user, acl).then((token) => {
        expect(token).toBeDefined();
        done();
    });
  });
});