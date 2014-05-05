// @requires GPT library (e.g., //www.googletagservices.com/tag/js/gpt.js)

// Set up a simple console noop for clients without a console
window.console = window.console || {log: function(m){}};

// Timestamp for load metrics.
var tsCreate = new Date();

// Set up the `Adgeletti` object and its methods
window.Adgeletti = {
    log: log,
    // Data about the ads in a page
    data: {
        // A dictionary of ad positions, keyed by their respective breakpoints
        positions: {},
        // A dictionary of ad positions that are showing, keyed by their
        // respective breakpoints
        showing: {},
        // A dictionary of ad positions that have been displayed, keyed by
        // their respective breakpoints
        displayed: {},
        // Global keywords dictionary. May be empty.
        keywords: {}
    },

    // Adds a key/value pair to set of keywords passed to DFP
    add_keywords: function(dict){
        for(var key in dict){
            if(dict.hasOwnProperty(key)){
                this.data.keywords[key] = dict[key];
            }
        }
    },

    // Sets up an ad position by adding it to `data.positions`
    position: function(options){
        log('event', 'Slot ' + options.slot + ' defined.');
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
        console.log('Displaying ads for breakpoint "' + breakpoint + '"');

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
                console.log('Showing ad div #' + pos.div_id);
                document.getElementById(pos.div_id).style.display = 'block';
                pos.isHidden = false;
            }

            // Check whether the ad has already been displayed
            var already_displayed = false;
            for(var j = 0; j < displayed.length; j ++){
                if(displayed[j].div_id == pos.div_id){
                    console.log('Ad ' + pos.ad_unit_code + ' already displayed for breakpoint "' + breakpoint + '"');
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

                        googletag.pubads().addEventListener('slotRenderEnded', function (event) {
                            if (event.slot === slot) {
                                log('event', 'slotRenderEnded for ' + pos.slot);
                                var now = new Date();
                                log('metric', {
                                    event: 'Total load time',
                                    slot: pos.slot,
                                    value: now - tsCreate
                                });
                            }
                        });

                        // Handle companion ads
                        if(pos.is_companion){
                            console.log('Configuring companion ad in position for div ID `' + pos.div_id + '`');
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
                        //googletag.enableServices();
                        googletag.display(pos.div_id);
                    };
                    return inner;
                }

                // Tell Google to display the ad
                console.log('Displaying ad ' + pos.ad_unit_code + ' for breakpoint "' + breakpoint + '"');
                var inner = get_inner(pos, adg);
                inner();
            }
        }
    },

    // Hides all the ads in the page for the given breakpoint
    hide: function(breakpoint){
        console.log('Hiding ads for breakpoint "' + breakpoint + '"');

        // Get a list of showing positions for the breakpoint, or an empty list
        var showing = this.data.showing[breakpoint] || [];
        for(var i = 0; i < showing.length; ++i){
            var pos = showing[i];

            // Hide the ad div
            console.log('Hiding ad div #' + pos.div_id);
            document.getElementById(pos.div_id).style.display = 'none';
            // Mark as explicitly hidden by adgeletti.
            pos.isHidden = true;
        }

        // Reset the list of showing positions
        this.data.showing[breakpoint] = [];
    },

    // Refreshes all showing ads on the page
    refresh: function (){
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
        googletag.pubads().refresh(ads);
    }
};
log('event', 'Adgeletti defined.');
