describe('harmony setup', function () {
    beforeEach(setupHarmony);
    describe('harmony.load()', function () {
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
        it('adjusts element ids for duplicates', function () {
            conf.slots[2].name = 'TST00';
            harmony.load(conf);
            var el = document.getElementById(harmony.slot['TST00-1'].divId);
            expect(el).toBeDefined();
            expect(el.id).toEqual('DVID02-1');
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
        var opts,
            optionSet = function () {
                return opts = Options({
                    name: 'TST00',
                    breakpoint: 'BKP00',
                    id: 'DVID00'
                });
            };
        beforeEach(optionSet);
        it('creates an ad slot', function () {
            harmony.defineSlot(opts);
            expect(harmony.slot.TST00).toBeDefined();
            expect(harmony.breakpoint.BKP00).toBeDefined();
            expect(harmony.breakpoint.BKP00[0]).toBeDefined();
            expect(harmony.breakpoint.BKP00[0].divId).toEqual('DVID00');
        });
        it('handles duplicate slot names', function () {
            newDiv({
                id: 'DVI00-1',
                breakpoint: 'BKP00'
            });
            newDiv({
                id: 'DVI00-2',
                breakpoint: 'BKP00'
            });
            newDiv({
                id: 'DVI00-3',
                breakpoint: 'BKP00'
            });
            harmony.defineSlot(optionSet());
            harmony.defineSlot(optionSet());
            harmony.defineSlot(optionSet());
            harmony.defineSlot(optionSet());
            expect(harmony.slot('TST00').divId).toEqual('DVID00');
            expect(harmony.slot('TST00-1').divId).toEqual('DVID00-1');
            expect(harmony.slot('TST00-2').divId).toEqual('DVID00-2');
            expect(harmony.slot('TST00-3').divId).toEqual('DVID00-3');
        });
    });
});
