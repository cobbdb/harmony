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
* [Atlanta Journal Constitution](http://www.ajc.com)
* [Austin American-Statesman](http://www.statesman.com)
* [Palm Beach Post](http://www.palmbeachpost.com)
* [WSB-TV](http://www.wsbtv.com)
* [WEDR](http://www.wedr.com)
* [KIRO 7](http://www.kirotv.com)
* [Austin 360](http://www.austin360.com)
* .. and over a hundred more!

-------------
### Table of Contents
* [Introduction](#intro)
* [Setup Guide](#intro-setup)
  * [Loading Data](#loading)
  * [Binding Callbacks](#callbacks)
  * [Using Slot Data](#data)
  * [Eventing](#eventing)
* [Logging](#logging)
* [Example Setup](#ex-setup)

-------------
<a name="intro"/>
Harmony is a DFP supplement meant for large-scale enterprise advertising systems.
There are methods to help you quickly create new ad slots, adjust targeting on
the fly, and attach side-effects.

The original purpose behind the creation of Harmony was to provide a
lightning-fast JS API that could ingest a block of JSON ad configuration
to set up ads for a page. Beyond that, however, there are many utility
methods that simplify DFP ad code and give you powerful tools to build
dynamic page content around ad performance.

There is also built-in ad logging and metrics provided via the
[Lumberjack](https://github.com/cobbdb/lumberjack) library.

[Full docs are available here](https://cobbdb.github.io/harmony), but
let's go over some of the best parts
of Harmony. If you don't see support for something you are trying to do,
chances are it's in there somewhere! Just give the docs a quick scan.

<a name="intro-setup"/>
#### Quick setup.
Create your Harmony instance and use it however you want. There are two
ways to initialize a Harmony instance:

###### as a global
```html
<script src="path/to/harmony.js"></script>
<script>
    mylibs.harmony = Harmony();
</script>
```

###### as a CommonJS module
```javascript
// my-ads.js
var Harmony = require('harmonyjs');
module.exports = Harmony();
```

<a name="loading"/>
#### Load ad config en bulk.
Have your backend generate ad config based on admin settings and
keep the components completely agnostic.
```javascript
var myconf = {% load_ad_conf %};
mylibs.harmony.load(myconf);
```

<a name="callbacks"/>
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

<a name="data"/>
#### Access your ad data immediately.
Harmony exposes individual slot configuration for pain-free access.
```javascript
var slot = mylibs.harmony.slot('MY01'),
    possibleSizes = slot.sizes,
    slotId = slot.divId,
    slotAdunit = slot.adunit;
```
You can even directly call DFP slot methods.
```javascript
var slot = mylibs.harmony.slot('MY01'),
    targeting = slot.getTargetingMap();
slot.setTargeting('some', 'new targeting!');
```

<a name="eventing"/>
#### Create and use events.
Harmony features a robust eventing system that will avoid race conditions
on even the most complex websites.

###### trigger events just like jQuery
```javascript
// System-level events.
mylibs.harmony.trigger('myevent', somedata);
// Slot-level events.
mylibs.harmony.slot('MY01').trigger('anotherevent');
```

###### bind callbacks to custom events
```javascript
mylibs.harmony.on('myevent', function () {});
mylibs.harmony.one('myevent', function () {});
mylibs.harmony.slot('MY01').on('myevent', function () {});
mylibs.harmony.slot('MY01').one('myevent', function () {});
```

###### slotRenderEnded is provided for you
DFP's `slotRenderEnded` event is handled automatically for you
on each slot.
```javascript
mylibs.harmony.slot('MY01').on('slotRenderEnded', function (event) {});
```

###### bind lazy events
Callbacks are eager by default, meaning that they will trigger
on binding if the event has already been triggered. If you do not
want this behavior you can specify the callback be lazy instead.
```javascript
mylibs.harmony.slot('MY01').on('myLazyEvent', function () {}, true);
mylibs.harmony.one('myLazyEvent', function () {}, true);
```

###### clear callbacks for any event
```javascript
mylibs.harmony.off('myevent');
```

<a name="logging"/>
#### Debug the subsystem.
[Logging](http://cobbdb.github.io/lumberjack) lets you see what happened and when, so you can focus less
on debugging and more on coding.
```javascript
mylibs.harmony.log.readback('events', true);
```

#### Get slot performance metrics.
See exactly how long your system takes from setup to ad render.
Logging provided with [Lumberjack](http://cobbdb.github.io/lumberjack).
```javascript
mylibs.harmony.log.readback('metric', true);
```

<a name="ex-setup"/>
## Example Setup
Here is an example of a page setup using Harmony and jQuery.
```html
<head>
    <script src="path/to/site/bundle.js"></script>
    <script src="//www.googletagservices.com/tag/js/gpt.js"></script>
    <script>
    var libs = {
        harmony: Harmony()
    };
    $(function () {
        libs.harmony.load({
            slots: [{
                name: 'ad01',
                id: 'ad-div-01',
                adunit: '123/test/unit',
                sizes: [
                    [300, 250],
                    [728, 90]
                ],
                targeting: {
                    'custom': 'slot targeting'
                },
                breakpoint: 'myads'
            }],
            targeting: {
                'custom': 'system targeting'
            }
        });
        googletag.enableServices();
        libs.harmony.show.breakpoint('myads');
    });
    </script>
</head>
<body>
    <div id="ad-div-01"></div>
</body>
```

---------
* See: http://cobbdb.github.io/harmony/
* See: http://github.com/cobbdb/harmony
* License: MIT
