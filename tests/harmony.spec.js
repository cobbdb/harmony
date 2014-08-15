describe('harmony.js', function () {
    var harmony, conf;
    describe('construction', function () {
        it('throws no errors', function () {
            expect(function () {
                harmony = Harmony();
            }).not.toThrowError();
        });
        it('returns a useable instance', function () {
            harmony = Harmony();
            // Smoke check a couple attributes.
            expect(harmony.load).toBeDefined();
            expect(harmony.log).toBeDefined();
            expect(harmony.show).toBeDefined();
            expect(harmony.show.slot).toBeDefined();
        });
    });
    describe('method', function () {
        beforeEach(function () {
            harmony = Harmony();
            conf = {
                slots: [
                    Options(),
                    Options(),
                    Options()
                ],
                targeting: {}
            };
        });
        describe('harmony.load()', function () {
            it('creates ad slots', function () {
                conf.slots[0].name = 'TST00';
                conf.slots[1].name = 'TST01';
                harmony.load(conf);
                expect(harmony.slot.TST00).toBeDefined();
                expect(harmony.slot.TST01).toBeDefined();
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
            });
            it('creates an ad slot', function () {
                opts.name = 'TST00';
                opts.breakpoint = 'BKP00';
                opts.id = 'DVID00';
                harmony.defineSlot(opts);
                expect(harmony.slot.TST00).toBeDefined();
                expect(harmony.breakpoint.BKP00).toBeDefined();
                expect(harmony.breakpoint.BKP00[0]).toBeDefined();
                expect(harmony.breakpoint.BKP00[0].divId).toEqual('DVID00');
            });
        });
        describe('harmony.getSlot()', function () {
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
                harmony.load(conf);
            });
            it('fetches an existing ad slot', function () {
                var slot = harmony.getSlot('TST01');
                expect(slot.divId).toEqual('DVID01');
            });
            it('fetches a mock slot by default', function () {
                var slot = harmony.getSlot('BAD01');
                expect(slot).toBeDefined();
                expect(slot.divId).toBeUndefined();
            });
        });
        describe('display method', function () {
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
                harmony.load(conf);
            });
            describe('harmony.show', function () {
                describe('breakpoint()', function () {
                    it('throws no errors when breakpoint does not exist', function () {
                        expect(function () {
                            harmony.show.breakpoint('badpnt');
                        }).not.toThrowError();
                    });
                    it('calls display on slots', function () {
                        harmony.show.breakpoint('TSTPNT00');
                        expect(googletag.display.calls.count()).toEqual(2);
                    });
                    it('sets display:block on slots', function () {
                        harmony.show.breakpoint('TSTPNT01');
                        expect(elemSpies.length).toEqual(1);
                        expect(elemSpies[0].id).toEqual('DVID01');
                        expect(elemSpies[0].style.display).toEqual('block');
                    });
                });
                describe('slot()', function () {
                    it('calls display on a slot', function () {
                        harmony.show.slot('TST00');
                        expect(googletag.display).toHaveBeenCalled();
                    });
                    it('sets display:block on a slot', function () {
                        harmony.show.slot('TST02');
                        expect(elemSpies.length).toEqual(1);
                        expect(elemSpies[0].id).toEqual('DVID02');
                        expect(elemSpies[0].style.display).toEqual('block');
                    });
                });
            });
            describe('harmony.hide', function () {
                describe('breakpoint()', function () {
                    it('throws no errors when breakpoint does not exist', function () {
                        expect(function () {
                            harmony.hide.breakpoint('badpnt');
                        }).not.toThrowError();
                    });
                    it('sets display:none on slots', function () {
                        harmony.hide.breakpoint('TSTPNT00');
                        expect(elemSpies.length).toEqual(2);
                        expect(elemSpies[0].id).toEqual('DVID00');
                        expect(elemSpies[0].style.display).toEqual('none');
                        expect(elemSpies[1].id).toEqual('DVID02');
                        expect(elemSpies[1].style.display).toEqual('none');
                    });
                });
                describe('slot()', function () {
                    it('sets display:none on a slot', function () {
                        harmony.hide.slot('TST01');
                        expect(elemSpies.length).toEqual(1);
                        expect(elemSpies[0].id).toEqual('DVID01');
                        expect(elemSpies[0].style.display).toEqual('none');
                    });
                });
            });
        });
    });
});
