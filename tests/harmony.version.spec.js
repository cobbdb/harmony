var harmony = require('../src/harmony.js');

describe('harmony.version', function () {
    var version;
    beforeEach(function () {
        version = harmony.version;
    });
    it('is exposed as String', function () {
        expect(version).toBeDefined();
        expect(typeof version).toEqual('string');
    });
    it('matches version in package.json', function () {
        var npmVersion = require('../package.json').version;
        expect(version).toEqual(npmVersion);
    });
});
