/**
 * # Show Action
 * Show a slot or group of slots.
 */

var SlotFactory = require('../modules/slot-factory.js'),
    GroupFactory = require('../modules/group-factory.js'),
    masterGroup = require('../modules/master-group.js'),
    log = require('../modules/log.js'),
    enableServices = require('../util/enable-services.js'),
    googletag = require('../modules/googletag.js');

/**
 * ## harmony.show
 * Activate Slots and make their ad calls. If a slot has already been
 * activated, then calls to `show` will refresh its contents.
 */
module.exports = {
    /**
     * ### all()
     * *Danger Zone* Show all slots in the page.
     */
    all: function () {
        var refreshGroup = [];
        enableServices();
        masterGroup.forEach(function (slot) {
            if (slot.enabled) {
                if (slot.active) {
                    refreshGroup.push(slot.gpt);
                } else {
                    slot.activate();
                    googletag.display(slot.id);
                }
            }
        });
        if (refreshGroup.length) {
            googletag.pubads().refresh(refreshGroup);
        }
    },
    /**
     * ### group(name)
     * Show all ads in a group.
     * @param {string} name
     */
    group: function (name) {
        var group = GroupFactory.create(name),
            refreshGroup = [];
        enableServices();
        group.forEach(function (slot) {
            if (slot.enabled) {
                if (slot.active) {
                    refreshGroup.push(slot.gpt);
                } else {
                    slot.activate();
                    googletag.display(slot.id);
                }
            }
        });
        if (refreshGroup.length) {
            googletag.pubads().refresh(refreshGroup);
        }
    },
    /**
     * ### slot(name)
     * Show a single ad slot.
     * @param {string} name
     */
    slot: function (name) {
        var slot = SlotFactory.get(name);
        if (slot.enabled) {
            enableServices();
            if (slot.active) {
                googletag.pubads().refresh([slot.gpt]);
            } else {
                slot.activate();
                googletag.display(slot.id);
            }
        }
    }
};
