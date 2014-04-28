// Look for noisy setting. Defaults to false in
// browsers that don't have LS. truthy, but devs can
// use 'delete localStorage.noisy' to disable.
var noisy, loggingEnabled;
try {
    noisy = localStorage.noisy;
    loggingEnabled = true;
} catch (err) {
    // No localStorage in this browser and probably no console
    // either, so there is no point in logging.
    noisy = false;
    loggingEnabled = false;
}

/**
 * Utility for system logging.
 * @param {String} [msg] Log entry.
 */
function log(msg) {
    if (loggingEnabled) {
        if (!msg) {
            // Dump to console when called empty.
            console.log(log);
        } else {
            // Store message and update console if noisy.
            log += '> ' + msg + '\n';
            if (noisy) {
                console.log('H> ' + msg);
            }
        }
    }
};
