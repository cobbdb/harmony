/**
 * # DFP Global API Object
 * `googletag` is the global API object for GPT.
 * @type {Object}
 * @see https://developers.google.com/doubleclick-gpt/reference#googletag
 */

var googletag = global.googletag = global.googletag || {};
googletag.cmd = googletag.cmd || [];
module.exports = googletag;
