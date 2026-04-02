/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import type Application from "./Application";
import Events from "./Events";

class Loader extends Events {
	app: Application;

	queue: number = 0;
	count: number = 0;
	ready: boolean = false;
	progress = 0;

	constructor(app: Application) {
		super();
		this.app = app;

		PLAYGROUND.Events.call(this);

		this.reset();
	}

	add(id: string) {
		this.queue++;
		this.count++;
		this.ready = false;
		this.trigger("add", id);

		return id;
	}

	/**
	 * Report an error to the loader.
	 * */
	error(id: string) {
		this.trigger("error", id);
	}

	/**
	 * Report a success to the loader.
	 * */
	success(id: string) {
		this.queue--;

		this.progress = 1 - this.queue / this.count;

		this.trigger("load", id);

		if (this.queue <= 0) {
			this.reset();
			this.emit("ready");
		}
	}

	/**
	 * Bring loader back to the ground state
	 */
	reset() {
		this.progress = 0;
		this.queue = 0;
		this.count = 0;
		this.ready = true;
	}
}

export default Loader;
