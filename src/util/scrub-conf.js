/**
 * # Configuration Scrubber
 * Ensures a slot's name and id are unique in the page. If a
 * container has content, it is assumed that an ad call has already
 * been made.
 * @param {Object} conf Configuration for a single ad slot.
 * @return {Object} Clean slot configuration.
 * @throws When div id is not found in the DOM.
 */

var ids = require('./id-factory.js'),
    slots = require('../slot-set.js');

module.exports = function (conf) {
    var el = global.document.getElementById(conf.id),
        newId;

    if (el) {
        newId = ids.next();
        conf.id = el.id = 'h-ad-' + newId;
        if (slots.has(conf.name)) {
            conf.name += '-h' + newId;
        }
        return conf;
    }
    throw Error('Ad slot container was not found in the DOM #' + conf.id);
};
