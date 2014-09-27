var harmony, conf;
function setupHarmony() {
    harmony = Harmony({
        // Provide logging for test debug.
        forceLog: true
    });
    conf = {
        slots: [
            Options({
                name: 'TST00',
                id: 'DVID00',
                breakpoint: 'TSTPNT00'
            }),
            Options({
                name: 'TST01',
                id: 'DVID01',
                breakpoint: 'TSTPNT01'
            }),
            Options({
                name: 'TST02',
                id: 'DVID02',
                breakpoint: 'TSTPNT00'
            })
        ],
        targeting: {}
    };
    conf.slots.forEach(newDiv);
}
function newDiv(opts) {
    $('<div>', {
        id: opts.id,
        'class': 'testdiv ' + opts.breakpoint
    }).appendTo('body');
}
afterEach(function () {
    $('.testdiv').remove();
});
