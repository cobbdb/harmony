var log = require('../../src/modules/log.js');

afterEach(function () {
    global.localStorage.removeItem('lumberjack');
    log.flush();
    log.disable();
});
