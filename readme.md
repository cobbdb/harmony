[![Harmony](http://i.imgur.com/DP1OvVj.png)](https://cobbdb.github.io/harmony)

[![Build Status](https://travis-ci.org/cobbdb/harmony.svg?branch=master)](https://travis-ci.org/cobbdb/harmony) [![Bower version](https://badge.fury.io/bo/harmony.svg)](http://badge.fury.io/bo/harmony) [![NPM version](https://badge.fury.io/js/harmonyjs.svg)](http://badge.fury.io/js/harmonyjs)

Doubleclick JS API Helper.

    $ bower install harmony
    $ npm install harmonyjs

-------------
##### [Link to full autodocs](https://cobbdb.github.io/harmony)

Harmony is provided as both a CommonJS module via `npm install harmonyjs`
and as a JS global variable via `bower install harmony`.

Some great sites that use Harmony:
* www.ajc.com
* www.statesman.com
* www.palmbeachpost.com
* www.wsbtv.com
* www.wedr.com
* www.kirotv.com
* www.austin360.com
* .. and over a hundred more sites!

-------------
Harmony is a DFP supplement meant for large-scale enterprise advertising systems.
There are methods to help you quickly create new ad slots, adjust targeting on
the fly, and attach side-effects.

The original purpose behind the creation of Harmony was to provide a
lightning-fast JS API that could injest a block of JSON ad configuration
to set up ads for a page. Beyond that, however, there are many utility
methods that simplify DFP ad code and give you powerful tools to build
dynamic page content around ad performance.

There is also build-in ad logging and metrics provided via the
[Lumberjack](https://github.com/cobbdb/lumberjack) library.

[Full docs are available here](https://cobbdb.github.io/harmony), but
let's go over some of the best parts
of Harmony. If you don't see support for something you are trying to do,
chances are it's in there somewhere! Just give the docs a quick scan.

#### Quick setup.
Create your Harmony instance and use it however you want.
```javascript
mylibs.harmony = Harmony();
```

#### Load ad config en bulk.
Have your backend generate ad config based on admin settings and
keep the components completely agnostic.
```javascript
var myconf = {% load_ad_conf %};
mylibs.harmony.load(myconf);
```

#### Attach some callbacks.
Easily attach behaviors based on the ad call, rather than side-effects
such as container visibility or size. Harmony lets you code deliberately!
```javascript
mylibs.harmony.slot('MY01').on('slotRenderEnded', function (event) {
    if (!event.isEmpty) {
        makeRoomForAd();
    }
});
```

#### Access your ad data immediately.
Harmony exposes individual slot configuration for pain-free access.
```javascript
var slot = mylibs.harmony.slot('MY01'),
    possibleSizes = slot.sizes,
    slotId = slot.divId,
    slotAdunit = slot.adunit;
```

#### Debug the subsystem.
Logging lets you see what happened and when, so you can focus less
on debugging and more on coding.
```javascript
mylibs.harmony.log.readback('events', true);
```

#### Get slot performance metrics.
See exactly how long your system takes from setup to ad render.
```javascript
mylibs.harmony.log.readback('metric', true);
```

## Example Setup
Here is an example of a page setup using Harmony and jQuery.
```html
<head>
    <script>
    var libs = {
        harmony: Harmony()
    };
    $(function () {
        libs.harmony.load({
            slots: [{
                name: 'ad01',
                id: 'ad01',
                adunit: '123/test/unit',
                sizes: [
                    [300, 250],
                    [728, 90]
                ],
                targeting: {
                    'custom': 'slot targeting'
                },
                breakpoints: 'testads'
            }],
            targeting: {
                'custom': 'system targeting'
            }
        });
        googletag.enableServices();
        libs.harmony.show.breakpoint('testads');
    });
    </script>
</head>
<body>
    <div id="ad01"></div>
</body>
```

---------
* See: http://cobbdb.github.io/harmony/
* See: http://github.com/cobbdb/harmony
* License: MIT
