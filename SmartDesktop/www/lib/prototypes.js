/*-------------------------------------------------------------------------
| SAE - Scripted Amiga Emulator
| https://github.com/naTmeg/ScriptedAmigaEmulator
|
| Copyright (C) 2012-2016 Rupert Hausberger
|
| This program is free software; you can redistribute it and/or
| modify it under the terms of the GNU General Public License
| as published by the Free Software Foundation; either version 2
| of the License, or (at your option) any later version.
|
| This program is distributed in the hope that it will be useful,
| but WITHOUT ANY WARRANTY; without even the implied warranty of
| MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
| GNU General Public License for more details.
-------------------------------------------------------------------------*/
/* Object */

if (!Object.prototype.clone) {
	Object.prototype.clone = function() {
		var copy = {}; //this.constructor();
		for (var attr in this) {
			if (this.hasOwnProperty(attr))
				copy[attr] = this[attr];
		}
		return copy;
	};
}

/*-----------------------------------------------------------------------*/
/* Math */

if (!Math.truncate) {
	Math.truncate = function(v) {
		if (v > 0)
			return this.floor(v);
		else if (v < 0)
			return this.ceil(v);

		return 0;
	};
}

if (!Math.decimalRandom) {
	Math.decimalRandom = function() {
		//var l = 0, u = 0xffffffff; return this.floor((this.random() * (u - l + 1)) + l);
		return (this.random() * 0xffffffff) >>> 0;
	};
}

/*-----------------------------------------------------------------------*/
/* Date/Performance */

if (!Date.now) {
	console.warn("This browser does not support 'Date.now()'. Falling back to 'Date.getTime()'...");
	/* milliseconds since 1 January 1970 00:00:00 UTC */
	Date.now = function() {
		return new Date().getTime();
	};
}

if (!window.performance) {
	console.warn("This browser does not support 'window.performance'. Falling back to 'Date'...");
	window.performance = {};
}
if (!performance.timing) {
	performance.timing = {
		navigationStart: Date.now()
	};
}
if (!performance.now) {
	if (performance.webkitNow)
		performance.now = performance.webkitNow;
	else
		performance.now = function() {
			return Date.now() - this.timing.navigationStart;
		};
}
