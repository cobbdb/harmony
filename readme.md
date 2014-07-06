[![Harmony](http://i.imgur.com/DP1OvVj.png)](https://cobbdb.github.io/harmony)

[![Build Status](https://travis-ci.org/cobbdb/harmony.svg)](https://travis-ci.org/cobbdb/harmony) [![Bower version](https://badge.fury.io/bo/harmony.svg)](http://badge.fury.io/bo/harmony)

Doubleclick JS API Helper.

    $ bower install harmony

-------------
Harmony is a tool to make the DFP API a bit more simple to use. There are
methods to help you quickly create new ad slots, adjust targeting on the fly,
and attach side-effects.

The original purpose behind the creation of Harmony was to provide a
lightning-fast JS API that could injest a block of JSON ad configuration
to set up ads for a page. Beyond that, however, there are many utility
methods that simplify DFP ad code and give you powerful tools to build
dynamic page content around ad performance.

There is also build-in ad logging and metrics provided via the
[Lumberjack](https://github.com/cobbdb/lumberjack) library.

Full docs are available here, but let's go over some of the best parts
of Harmony. If you don't see support for something you are trying to do,
chances are it's in there somewhere! Just give the docs a quick scan.

#### Quick setup.
Create your Harmony instance and use it however you want.

    mylibs.harmony = Harmony();

#### Load ad config en bulk.
Have your backend generate ad config based on admin settings and
keep the components completely agnostic.

    var myconf = {% load_ad_conf %};
    mylibs.harmony.load(myconf);

#### Attach some callbacks.
Easily attach behaviors based on the ad call, rather than side-effects
such as container visibility or size. Harmony lets you code deliberately!

    mylibs.harmony.slot.MY01.on('slotRenderEnded', function (event) {
        if (!event.isEmpty) {
            makeRoomForAd();
        }
    });

#### Access your ad data immediately.
Harmony exposes individual slot configuration for pain-free access.

    var possibleSizes = mylibs.harmony.slot.MY01.sizes;
    var slotId = mylibs.harmony.slot.MY01.divId;
    var slotAdunit = mylibs.harmony.slot.MY01.adunit;

#### Debug the subsystem.
Logging lets you see what happened and when, so you can focus less
on debugging and more on coding.

    mylibs.harmony.log.readback('events', true);

#### Get slot performance metrics.
See exactly how long your system takes from setup to ad render.

    mylibs.harmony.log.readback('metric', true);

---------
* See: http://cobbdb.github.io/harmony/
* See: http://github.com/cobbdb/harmony
* License: MIT
