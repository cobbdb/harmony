describe('accessor', function () {
    beforeEach(function () {
        setupHarmony();
        conf.slots[0].name = 'TST00';
        conf.slots[0].id = 'DVID00';
        conf.slots[0].breakpoint = 'TSTPNT00';
        conf.slots[1].name = 'TST01';
        conf.slots[1].id = 'DVID01';
        conf.slots[1].breakpoint = 'TSTPNT01';
        conf.slots[2].name = 'TST02';
        conf.slots[2].id = 'DVID02';
        conf.slots[2].breakpoint = 'TSTPNT00';
        harmony.load(conf);
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
