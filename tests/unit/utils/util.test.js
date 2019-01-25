const {formatPermissions} = require('../../../utils/util');

describe('utils utils', () => {
    let access = [
        {
            description: "only read",
            permissions: [{
                "/api/books": ["GET"],
                "/api/authors": ["GET"]
            }, {"/api/purchases": ["GET"]}]
        },
        { 
            description: "only write",
            permissions: [{ 
                "/api/books": ["POST"],
                "/api/authors": ["GET","POST"]
                }]
    }];

    it('Generate object format with well formed access', () => {
        expect(formatPermissions(access)).toMatchObject({"/api/authors": ["GET", "POST"], "/api/books": ["GET", "POST"]});
    });

    it('Generate object format with bad formed access', () => {
        access = [];
        expect(formatPermissions(access)).toMatchObject({});
    });

    it('Generate object format with well formed access but bad array permissions', () => {
        access = [{
            description: "only read",
            permissions: {
                "/api/books": ["GET"],
                "/api/authors": ["GET"]
            }, 
        }];
        expect(formatPermissions(access)).toMatchObject({});
    });

});