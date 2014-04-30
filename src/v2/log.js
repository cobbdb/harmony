/**
 * # Log
 * Utility for system logging.
 */
var log = (function () {
    var noisy;
    var record = '';

    try {
        // Look for noisy setting. Defaults to false in
        // browsers that don't have LS. truthy, but devs can
        // use 'delete localStorage.noisy' to disable.
        noisy = localStorage.noisy;
    } catch (err) {
        // No localStorage in this browser and probably no console
        // either, so there is no point in logging. Return a stub.
        return function () {};
    }

    /**
     * ## harmony.log
     * Record an entry or fetch the entire record.
     * @param {String} [msg] Log entry.
     * @return {String} Entire log when called as ```harmony.log();```
     */
    var instance = function (msg) {
        if (!msg) {
            // Dump to console when called empty.
            console.log(record);
        } else {
            // Store message and update console if noisy.
            record += '> ' + msg + '\n';
            if (noisy) {
                console.log('H> ' + msg);
            }
        }
    };
    /**
     * harmony.log.flush
     * Clears the log and return entire record.
     * @return {String}
     */
    instance.flush = function () {
        var copy = record;
        record = '';
        console.log(copy);
        return copy;
    };
    return instance;
}());
