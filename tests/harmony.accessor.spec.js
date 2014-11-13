var Harmony = require('../src/harmony.js'),
    Help = require('./helper/construction.helper.js');

describe('accessor', function () {
    var harmony;
    beforeEach(function () {
        Help.setupDOM();
        harmony = Harmony();
        harmony.load(Help.getConf());
    });
    describe('harmony.slot()', function () {
        it('fetches an existing ad slot', function () {
            var slot = harmony.slot('TST01');
            expect(slot.divId).toEqual('DVID01');
        });
        it('fetches a mock slot by default', function () {
            var slot = harmony.slot('BAD01');
            expect(slot).toBeDefined();
            expect(slot.divId).toBeUndefined();
        });
    });
    describe('harmony.breakpoint()', function () {
        it('fetches an existing breakpoint', function () {
            var bp = harmony.breakpoint('TSTPNT00');
            expect(bp.length).toEqual(2);
            expect(bp[1].divId).toEqual('DVID02');
        });
        it('fetches an empty array by default', function () {
            var bp = harmony.breakpoint('BAD02');
            expect(bp.length).toEqual(0);
            expect(bp).toEqual([]);
        });
    });
});
