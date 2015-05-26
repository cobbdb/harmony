var log = require('../../src/log.js');

afterEach(function () {
    global.localStorage.removeItem('lumberjack');
    log.flush();
    log.disable();
});
