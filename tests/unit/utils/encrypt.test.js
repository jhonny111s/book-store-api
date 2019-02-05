const {generate, compare} = require('../../../utils/encrypt');

describe('utils encrypt', () => {
    let encriptPass = "";
    let password = "";

    beforeEach((done) => {
        password = "123";
        generate(password).then ((hash) => {
            encriptPass = hash;
            done();
        });
    });

    describe('generate', () => {
        it('should genarate hash', () => {
            return expect(generate(password)).resolves.toBeDefined();
        });

        it('error genarating salt', () => {
            return expect(generate("123", {})).rejects.toThrow();
        });
    
        it('error genarating hash', () => {
            return expect(generate([])).rejects.toThrow();
        });
    });

    describe('compare', () => {
        it('should has a true compared', () => {
            return expect(compare(password, encriptPass)).resolves.toBeTruthy();
        });
    
        it('should has a false compared', () => {
            return expect(compare("1234", encriptPass)).resolves.toBeFalsy();
        });

        it('should error', () => {
            return expect(compare({}, encriptPass)).rejects.toThrowError();
        });
    });
});