[![Harmony](http://i.imgur.com/DP1OvVj.png)](https://cobbdb.github.io/harmony)
*v7.4.1*

[![License](https://img.shields.io/npm/l/harmonyjs.svg)](http://npmjs.com/package/harmonyjs)
[![Build Status](https://travis-ci.org/cobbdb/harmony.svg?branch=7.4.1)](https://travis-ci.org/cobbdb/harmony)
[![Bower version](https://badge.fury.io/bo/harmony.svg)](http://badge.fury.io/bo/harmony)
[![NPM version](https://badge.fury.io/js/harmonyjs.svg)](http://badge.fury.io/js/harmonyjs)
[![Dependencies](https://img.shields.io/david/dev/cobbdb/harmony.svg)](./package.json)

Simplify your DFP business logic.

    $ bower i harmony
    $ npm i harmonyjs

[![NPM info](https://nodei.co/npm/harmonyjs.png?stars=true&downloads=true)](https://nodei.co/npm-dl/harmonyjs/)
[![NPM downloads](https://nodei.co/npm-dl/harmonyjs.png?months=6&height=2)](https://nodei.co/npm-dl/harmonyjs/)

-------------
##### [Link to full autodocs](https://cobbdb.github.io/harmony/7.4.1)

Harmony is provided as both a CommonJS module via `npm install harmonyjs`
and as a JS global variable via `bower install harmony`.

### Table of Contents
* [Introduction](#intro)
* [Setup Guide](#intro-setup)
  * [Loading Data](#loading)
  * [Binding Callbacks](#callbacks)
  * [Using Slot Data](#data)
  * [Eventing](#eventing)
* [Logging](#logging)
* [Example Setup](#ex-setup)
* [Contributing](#contributing)

-------------
<a name="intro"></a>
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

[Full docs are available here](https://cobbdb.github.io/harmony/7.4.1), but
let's go over some of the best parts
of Harmony. If you don't see support for something you are trying to do,
chances are it's in there somewhere! Just give the docs a quick scan.

<a name="intro-setup"></a>
#### Quick setup.
There are two ways to load Harmony:

###### as a global
```html
<script src="path/to/harmony.js"></script>
<script>
    console.log(harmony.version);
</script>
```

###### as a CommonJS module
```javascript
var harmony = require('harmonyjs');
global.console.log(harmony.version);
```

<a name="loading"></a>
#### Load ad config en bulk.
Have your backend generate configurations based on admin settings and
keep the components completely agnostic.
```javascript
var myconf = {% generate_ad_slots %};
harmony.load.slots(myconf);
```

<a name="callbacks"></a>
#### Attach some callbacks.
Easily attach behaviors based on the ad call, rather than side-effects
such as container visibility or size. Harmony lets you code deliberately!
```javascript
harmony.slot('MY01').on('slotRenderEnded', function (event) {
    if (!event.isEmpty) {
        // Some business logic here.
    }
});
```

<a name="data"></a>
#### Access your ad data immediately.
Harmony exposes individual slot configuration for pain-free access.
```javascript
var slot = harmony.slot('MY01'),
    possibleSizes = slot.sizes,
    slotId = slot.id,
    slotAdunit = slot.adunit;
```
You can even directly call DFP slot methods.
```javascript
var slot = harmony.slot('MY01'),
    targeting = slot.gpt.getTargetingMap();
slot.gpt.setTargeting('some', 'new targeting!');
```

<a name="eventing"></a>
#### Create and use events.
Harmony features a robust eventing system that will avoid race conditions
on even the most complex websites.

###### trigger events just like jQuery
```javascript
// System-level events.
harmony.trigger('myevent', somedata);
// Slot-level events.
harmony.slot('MY01').trigger('anotherevent');
```

###### bind callbacks to custom events
```javascript
harmony.on('myevent', function () {});
harmony.one('myevent', function () {});
harmony.slot('MY01').on('myevent', function () {});
harmony.slot('MY01').one('myevent', function () {});
```

###### GPT events are provided for you
GPT's `slotRenderEnded` and `impressionViewable` events are handled
automatically for you on each slot.
```javascript
harmony.slot('MY01').on('slotRenderEnded', function (event) {});
harmony.slot('MY01').on('impressionViewable', function (event) {});
```

###### bind lazy events
Callbacks are eager by default, meaning that they will trigger
on binding if the event has already been triggered. If you do not
want this behavior you can specify the callback be lazy instead.
```javascript
harmony.slot('MY01').on('myLazyEvent', function () {}, true);
harmony.one('myLazyEvent', function () {}, true);
```

###### clear callbacks for any event
```javascript
harmony.off('myevent');
```

<a name="logging"></a>
#### Enable logging.
Logging is off by default for performance, but can be easily enabled.
```javascript
// Enable logging before page refresh.
localStorage.lumberjack = 'on';

// Enable logging without page refresh.
harmony.log.enable();
```

#### Debug the subsystem.
[Logging](http://cobbdb.github.io/lumberjack) lets you see what happened and when, so you can focus less
on debugging and more on coding.
```javascript
harmony.log.readback('events', true);
```

#### Get slot performance metrics.
See exactly how long your system takes from setup to ad render.
Logging provided with [Lumberjack](http://cobbdb.github.io/lumberjack).
```javascript
harmony.log.readback('metric', true);
```

<a name="ex-setup"></a>
## Example Setup
Here is an example of a page setup using Harmony and DFP.
```html
<head>
    <script src="path/to/harmony.js"></script>
    <script src="//www.googletagservices.com/tag/js/gpt.js"></script>
</head>
<body>
    <div id="my-ad-div"></div>
    <script>
        harmony.defineSlot({
            name: 'my-ad',
            id: 'my-ad-div',
            adunit: '123/ad/unit',
            sizes: [
                [300, 250],
                [728, 90]
            ],
            targeting: {
                some: 'custom criteria'
            }
        });
        harmony.show.slot('my-ad');
    </script>
</body>
```

<a name="contributing"></a>
## Contributing
How to test and build your changes.

### Testing
```shell
# Full test suite.
$ grunt test
# Test a single spec.
$ grunt test --spec=spec.name
```

### Building
```shell
# Full build suite minus autodocs.
$ grunt
```

### Deploying

* Will fail for non-owners.
* Windows only.
* Autodocs are built from `/tasks/build-docs/readme.tpl`
* Remember to update changelog.

```shell
# Full build including autodocs, tag, and deploy.
$ grunt version:<type>:"<msg>"
# Type can be major, minor, patch.
```

---------
* See: http://cobbdb.github.io/harmony
* See: http://github.com/cobbdb/harmony
* License: MIT
