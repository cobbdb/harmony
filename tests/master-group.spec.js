var harmony = require('../src/harmony.js'),
    group = require('../src/modules/master-group.js');

describe('masterGroup', function () {
    it('exposes common Group members', function () {
        expect(group.name).toBeUndefined();
        expect(function () {
            group.length();
            group.add({
                name: 'test-slot'
            });
            group.get();
            group.getAll();
            group.has();
            group.forEach();
            group.clear();
        }).not.toThrow();
    });
    it('is exposed as an api feature', function () {
        expect(harmony.slots).toBeDefined();
        expect(harmony.slots.get).toBeDefined();
        expect(harmony.slots.getAll).toBeDefined();
    });
});
