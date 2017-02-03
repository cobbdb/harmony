/**
 * # Configuration Scrubber
 */

var masterGroup = require('../modules/master-group.js'),
    cache = {};

/**
 * ## scrubConf(conf)
 * Ensures a slot's id is unique in the page. Duplicate containers
 * have their ids mutated with a `-N`, where `N` is an incrementing
 * integer. Does not alter id of first or non-duplicate slots.
 * @param {Object} conf Configuration for a single ad slot.
 * @return {Object} Clean slot configuration.
 * @throws When div id is not found in the DOM.
 */
module.exports = function (conf) {
    var el = global.document.getElementById(conf.id),
        suffix = 0;

    if (el) {
        do {
            suffix += 1;
            conf.id = el.id + '-h' + suffix;
        } while (conf.id in cache);
        el.id = conf.id;
        cache[conf.id] = true;
        return conf;
    }
    throw Error('Ad slot ' + conf.name + ' container #' + conf.id + ' was not found!');
};

/**
 * ## scrubConf.clear()
 * Reset the slot id cache.
 */
module.exports.clear = function () {
    cache = {};
};
