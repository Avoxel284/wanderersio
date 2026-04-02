/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import type Application from "./Application";

/**
 * Abstracts away differences between mouse and touches.
 *
 * The object simply listens to global events raised by application and
 * raises new (global) events on behalf of the application.
 *
 * Following events are raised:
 * - pointerdown:mouse button down or start tracking touch point
 * - pointerup: mouse button release or touch point release
 * - pointermove: mouse pointer or touch point moved
 * - pointerwheel: mouse wheel rotated
 *
 * Reference: http://playgroundjs.com/playground-pointer
 */

class Pointer {
	app: Application;
	x = 0;
	y = 0;

	constructor(app:Application) {
		this.app = app;

		app.on("touchstart", (event, data)=> this.handleTouchStart(data),this)

		app.on("touchstart", this.touchstart, this);
		app.on("touchend", this.touchend, this);
		app.on("touchmove", this.touchmove, this);

		app.on("mousemove", this.mousemove, this);
		app.on("mousedown", this.mousedown, this);
		app.on("mouseup", this.mouseup, this);
		app.on("mousewheel", this.mousewheel, this);

		this.pointers = app.pointers = {};

		this.app.pointer = this;

		this.lastTap = 0;
	}

	handleTouchStart(event:TouchEvent){
		event.touch
	}
}

export default Pointer;
