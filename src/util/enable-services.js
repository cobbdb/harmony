/**
 * # GPT Services Handler
 * Enables all GPT services if not already done.
 */

var googletag = require('../googletag.js');
module.exports = function () {
    if (!googletag.pubadsReady) {
        googletag.enableServices();
    }
};
