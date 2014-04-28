var AdSlot = require('./AdSlot');
var log = require('./log');

/**
 * # Harmony
 * ***DFP JavaScript API Helper***
 * This method will self destruct after calling. There should only ever
 * be one instance of Harmony in existance at any time.
 * @api public
 * @param {Object} opts
 * @param {Array} opts.slots List of ad slot information.
 * @param {Object} opts.targeting Key/value targeting pairs.
 * @return {Object} Harmony instance.
 */
window.Harmony = function (opts) {
    var slots = {};

    // ### Initial system startup.
    googletag.cmd.push(function () {
        // Generate all the ad slots.
        var i;
        var conf = opts.slots;
        var pubads = googletag.pubads();
        for (i = 0; i < conf; i += 1) {
            slots[opts.name] = AdSlot(pubads, conf[i]);
        }

        // Assign the system targeting.
        log('Applying pubads targeting.');
        conf = opts.targeting;
        for (i in conf) {
            log('- ' + i + ' = ' conf[i]);
            pubads.setTargeting(i, conf[i]);
        }
    });

    // Create the new harmony instance.
    var instance = {
        // ## harmony.log
        // @see log.js
        // Debug log tool intended for developers only.
        log: log,
        // ## harmony.slot.<name>
        // Access a specific ad slot in the page.
        slot: slots,
        /**
         * ## harmony.defineSlot
         * Create a new adSlot in the page.
         * @param {Object} opts Options object.
         * @param {String} opts.name Slot name, ex) RP01
         * @param {String} opts.id Slot's div id, ex) ad-div-RP01
         * @param {Array} opts.sizes One or many 2D arrays, ex) [300, 250]
         * @param {String} opts.adunit Full ad unit code.
         * @param {Object} [opts.targeting] Slot-specific targeting.
         * @param {Array} [opts.mapping] Size mapping.
         * @param {Boolean} [opts.companion] True if companion ad.
         * @param {String} [opts.breakpoint] Display point, ex) 0px-infinity
         * @param {Boolean} [opts.interstitial] True if out-of-page ad.
         * @param {Function} [opts.callback] Called on dfp's slotRenderEnded.
         */
        defineSlot: function (opts) {
            var pubads = googletag.pubads();
            slots[opts.name] = AdSlot(pubads, opts);
        },
        // Sets up an ad position by adding it to `data.positions`
        position: function(options){
            // Required in the provided options are the following keys: "breakpoint",
            // "ad_unit_code", "sizes", and "div_id"
            var positions = this.data.positions[options.breakpoint] = this.data.positions[options.breakpoint] || [];
            positions.push({
                ad_unit_code: options.ad_unit_code,
                sizes: options.sizes,
                div_id: options.div_id,
                slot: options.slot,
                is_companion: options.is_companion
            });
        },
        // Displays all ads in the page for the given breakpoint
        display: function(breakpoint){
            log('Displaying ads for breakpoint "' + breakpoint + '"');

            // Ensure a list for the breakpoint in `data.displayed`
            var displayed = this.data.displayed[breakpoint] = this.data.displayed[breakpoint] || [];
            // Ensure a list for the breakpoint in `data.showing`
            var showing = this.data.showing[breakpoint] = this.data.showing[breakpoint] || [];
            // Get a list of positions for the breakpoint, or an empty list
            var positions = this.data.positions[breakpoint] || [];

            // Loop through the breakpoint's positions, showing each's div, and
            // using `googletag.pubads().display(...)` to display ones that haven't
            // already been displayed
            for(var i = 0; i < positions.length; ++i){
                var pos = positions[i];

                // Add the position to the list of showing positions, so that its
                // div can be hidden via `this.hide(...)`
                showing.push(pos);

                // Only show divs that were explicitly hidden by adgeletti.
                if (pos.isHidden) {
                    // Show the div and add it to `data.showing`
                    log('Showing ad div #' + pos.div_id);
                    document.getElementById(pos.div_id).style.display = 'block';
                    pos.isHidden = false;
                }

                // Check whether the ad has already been displayed
                var already_displayed = false;
                for(var j = 0; j < displayed.length; j ++){
                    if(displayed[j].div_id == pos.div_id){
                        log('Ad ' + pos.ad_unit_code + ' already displayed for breakpoint "' + breakpoint + '"');
                        already_displayed = true;
                        break;
                    }
                }

                // Display the ad, if it's not already
                if(!already_displayed){
                    // Add the position to the list of displayed positions
                    displayed.push(pos);

                    // Create a reference to `this`, since the function below will
                    // have a different scope
                    var adg = this;

                    // Define a function in another, to avoid a BS variable scoping
                    // issue that V8's optimizations causes
                    function get_inner(pos, adg){
                        var inner = function(){
                            // Create the ad slot
                            var slot = googletag.defineSlot(pos.ad_unit_code, pos.sizes, pos.div_id);

                            // Handle companion ads
                            if(pos.is_companion){
                                log('Configuring companion ad in position for div ID `' + pos.div_id + '`');
                                // Enable companion ads
                                slot.addService(googletag.companionAds());
                            }

                            // Attach to the publisher service to support preload
                            slot.addService(googletag.pubads());

                            // Add key-value targeting, based on `adg.data.keywords`
                            for(var key in adg.data.keywords){
                                if(adg.data.keywords.hasOwnProperty(key)){
                                    slot.setTargeting(key, adg.data.keywords[key]);
                                }
                            }

                            // Add key-value targeting for the "slot" (e.g. "TOP BOX")
                            slot.setTargeting('ad_slot', pos.slot);

                            // Duplicate the ad slot key-value pair as "adposition" for
                            // historical reasons
                            slot.setTargeting('adposition', pos.slot);

                            // Attach the defined slot to the position
                            pos.ad = slot;

                            // Display the ad
                            googletag.enableServices();
                            googletag.display(pos.div_id);
                        };
                        return inner;
                    }

                    // Tell Google to display the ad
                    log('Displaying ad ' + pos.ad_unit_code + ' for breakpoint "' + breakpoint + '"');
                    googletag.cmd.push(get_inner(pos, adg));
                }
            }
        },
        // Hides all the ads in the page for the given breakpoint
        hide: function (breakpoint){
            log('Hiding ads for breakpoint "' + breakpoint + '"');

            // Get a list of showing positions for the breakpoint, or an empty list
            var showing = this.data.showing[breakpoint] || [];
            for(var i = 0; i < showing.length; ++i){
                var pos = showing[i];

                // Hide the ad div
                log('Hiding ad div #' + pos.div_id);
                document.getElementById(pos.div_id).style.display = 'none';
                // Mark as explicitly hidden by adgeletti.
                pos.isHidden = true;
            }

            // Reset the list of showing positions
            this.data.showing[breakpoint] = [];
        },
        /**
         * Refresh only ads in the current breakpoint.
         */
        refresh: function () {
            // Get a list of ads from the showing positions
            var ads = [];
            for(var key in this.data.showing){
                if(this.data.showing.hasOwnProperty(key)){
                    var positions = this.data.showing[key];
                    for (var i = 0; i < positions.length; i++) {
                        ads.push(positions[i].ad);
                    }
                }
            }
            // Refresh the list of ads
            googletag.cmd.push(function () {
                googletag.pubads().refresh(ads)
            });
        }
    };

    // Remove constructor from window.
    delete window.Harmony;
    return instance;
};
