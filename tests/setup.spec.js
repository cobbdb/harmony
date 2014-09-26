describe('harmony setup', function () {
    beforeEach(setupHarmony);
    describe('harmony.load()', function () {
        beforeEach(function () {
            conf.slots[0].name = 'TST00';
            conf.slots[0].id = 'DVID00';
            conf.slots[0].breakpoint = 'TSTPNT00';
            conf.slots[1].name = 'TST01';
            conf.slots[1].id = 'DVID01';
            conf.slots[1].breakpoint = 'TSTPNT01';
            conf.slots[2].name = 'TST02';
            conf.slots[2].id = 'DVID02';
            conf.slots[2].breakpoint = 'TSTPNT00';
        });
        it('creates ad slots', function () {
            harmony.load(conf);
            expect(harmony.slot.TST01).toBeDefined();
            expect(harmony.slot.TST01.breakpoint).toEqual('TSTPNT01');
        });
        it('handles duplicate slot names', function () {
            conf.slots[2].name = 'TST00';
            harmony.load(conf);
            expect(harmony.slot.TST00.name).toEqual('TST00');
            expect('TST00-1' in harmony.slot).toBe(true);
            expect(harmony.slot['TST00-1'].divId).toEqual('DVID02-1');
        });
        it('sets system targeting', function () {
            conf.targeting.TST = 'target';
            conf.targeting.TST2 = 'abc123';
            harmony.load(conf);
            expect(pubadsSpy.setTargeting).toHaveBeenCalledWith('TST', 'target');
            expect(pubadsSpy.setTargeting).toHaveBeenCalledWith('TST2', 'abc123');
        });
    });
    describe('harmony.defineSlot()', function () {
        var opts;
        beforeEach(function () {
            opts = Options();
            opts.name = 'TST00';
            opts.breakpoint = 'BKP00';
            opts.id = 'DVID00';
        });
        it('creates an ad slot', function () {
            harmony.defineSlot(opts);
            expect(harmony.slot.TST00).toBeDefined();
            expect(harmony.breakpoint.BKP00).toBeDefined();
            expect(harmony.breakpoint.BKP00[0]).toBeDefined();
            expect(harmony.breakpoint.BKP00[0].divId).toEqual('DVID00');
        });
        it('handles duplicate slot names', function () {
            harmony.defineSlot(opts);
            harmony.defineSlot(opts);
            harmony.defineSlot(opts);
            expect('TST00' in harmony.slot).toBe(true);
            expect(harmony.slot.TST00.divId).toEqual('DVID00');
            expect('TST00-2' in harmony.slot).toBe(true);
            expect(harmony.slot['TST00-2'].divId).toEqual('DVID00-2');
        });
    });
});
