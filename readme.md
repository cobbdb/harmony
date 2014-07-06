[![Harmony](http://i.imgur.com/DP1OvVj.png)](https://cobbdb.github.io/harmony)

[![Bower version](https://badge.fury.io/bo/harmony.svg)](http://badge.fury.io/bo/harmony) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Doubleclick JS API Helper.

    $ bower install harmony

-------------
#### Creating a new Lumberjack
Create one master instance if you'd like, or many instances for each system.

    var log = Lumberjack();

#### Log some information
Each log entry is tied to a channel and is created on the fly. This data
can be an Object, String, Number, or Boolean.

    log('signin', 'User has finished signing in.');

#### Attach some callbacks
You can attach side-effects to your log channels for analytics tools.
The data object is whatever data gets logged when the event trips.
You can even attach multiple callbacks to the same channel.

    log.on('contentload', function (data) {
        analytics.report(data);
    });

#### Trigger events
Define your behavior once and trigger it multiple times.

    log('contentload', {
        how: 'scroll',
        speed: 851
    });

#### Debug a subsystem
Get the logging information you care about with timestamps of when it happened.
Every log entry has a timestamp so you can tell when events happened.

    log.readback('gallery');
    log.readback('gallery', true); // Pretty-print

#### View all events in order
The master record contains all log entries in order.

    log.readback.master();
    log.readback.master(true); // Pretty-print

#### Remove side-effects
You can disable all existing callbacks for a single channel.

    log.off('scroll');

#### Analyzing entries
All log entries take the form:
```js
{
    time: // timestamp when entry was logged
    data: // the logged data
    channel: // channel of entry
    id: // id of entry in master record
}
```

---------
* See: http://cobbdb.github.io/harmony/
* See: http://github.com/cobbdb/harmony
* License: MIT
