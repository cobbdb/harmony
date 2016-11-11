# Change Log
All notable changes to Harmony will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## Version 7
#### [7.1.0]
- Expose master slot group as `harmony.slots`.

#### [7.0.2]
- `harmony.breakpoint()` now returns `undefined` when no
breakpoints have been set.

#### [7.0.1]
- Update breakpoint-watcher to use RequestAnimationFrame.
- Remove screen module in favor of `window.innerWidth`. IE9+.
- Stop mangling ad slot names. This forces developers to use
the grouping feature appropriately.
- Group slots together when refreshing with `show.group()`,
instead of refreshing one at a time.

## Version 6
#### [6.1.0]
- Expose system-level `impressionViewable` event.
- Attach slot name to GPT Slot object.

#### [6.0.0]
- Expose `slot.gpt` to decouple GPT slot from Harmony slot.
- Slot option `interstitial` changed to `outofpage`.
- Slots are no longer defined in GPT until they are displayed. This
is an effort to fix how Harmony behaves under Single Request Mode.
- Removed `hide.slot()` and `hide.group()` actions.
- Slot display styles are no longer altered by Harmony.
- Added support for ActiveView's impressionViewable event.
- Removed `harmony.hasSlot()`.
- Merged `harmony.show` and `harmony.refresh` into only `harmony.show`.
- Break up `harmony.load` into `load.targeting`, `load.slots`,
and `load.breakpoints`.

## Version 5
#### [5.0.2]
- Fixed bad NPM publishing credentials.

#### [5.0.1]
- Minor docs update.

#### [5.0.0]
- Mangle slot ids on slot creation always.
- Mangle slot names on creation for duplicates.
- Provide `googletag` by default.
- Enable GPT services on calls to `refresh()` and `show()`.

## Version 4
#### [4.1.0]
- Fully automated build process for docs and versioning.

#### [4.0.0]
- Remove global `Harmony()` constructor method.
- Expose API as a global object named `harmony`.
