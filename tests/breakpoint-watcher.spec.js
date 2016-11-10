var watcher = require('../src/modules/breakpoint-watcher.js');

describe('breakpointWatcher', function () {
    afterEach(function () {
        watcher.clear();
    });
    describe('add()', function () {
        it('accepts a single breakpoint', function () {
            watcher.add(1234);
            expect(watcher.getAll()).toEqual([1234]);
        });
        it('accepts multiple breakpoints', function () {
            watcher.add([34, 12, 56]);
            expect(watcher.getAll()).toEqual([12, 34, 56]);
        });
        it('accepts zero breakpoints', function () {
            watcher.add(1);
            watcher.add();
            watcher.add(2);
            expect(watcher.getAll()).toEqual([1, 2]);
        });
    });
    describe('current()', function () {
        it('works when size > bp', function () {
            var width = global.innerWidth;
            watcher.add(width - 1);
            expect(watcher.current()).toEqual(width - 1);
        });
        it('defaults to 1', function () {
            var width = global.innerWidth;
            watcher.add([width + 1, width + 2]);
            expect(watcher.current()).toEqual(1);
        });
        it('works with multiple breakpoints', function () {
            var width = global.innerWidth;
            watcher.add([width - 1, width + 1]);
            expect(watcher.current()).toEqual(width - 1);
        });
        it('returns undefined when no set breakpoints', function () {
            expect(watcher.current()).toBeUndefined();
        });
    });
    describe('run()', function () {
        var originalWidth = global.innerWidth;
        beforeEach(function () {
            watcher.add([1, 100, 200, 300, 500]);
        });
        afterEach(function () {
            global.innerWidth = originalWidth;
            watcher.off('update');
            watcher.clear();
        });
        it('triggers on first run', function (done) {
            watcher.on('update', function (bp) {
                expect(bp).toEqual(200);
                done();
            }, true);
            global.innerWidth = 200;
            watcher.run();
        });
        it('triggers on bp update', function (done) {
            global.innerWidth = 90;
            watcher.one('update', function (bp) {
                expect(bp).toEqual(1);
                global.innerWidth = 802;
                watcher.on('update', function (bp) {
                    expect(bp).toEqual(500);
                    done();
                }, true);
                watcher.run();
            }, true);
            watcher.run();
        });
    });
});
