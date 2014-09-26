describe('display method', function () {
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
