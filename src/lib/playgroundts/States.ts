/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import type Application from "./Application";
import Events from "./Events";

class States extends Events {
	app: Application;
	next: any;
	current: any;

	constructor(app: Application) {
		super();
		this.app = app;

		PLAYGROUND.Events.call(this);

		app.on("step",() =>this.step());
	}

	/**
	 * Called each frame to update logic
	 */
	step(delta?: number) {
		if (!this.next) return;

		if (this.current && this.current.locked) return;

		var nextState = this.next;

		if (typeof nextState === "function") nextState = new nextState();

		/* create state if object has never been used as a state before */

		if (!nextState.__created) {
			nextState.__created = true;

			nextState.app = this.app;

			this.trigger("createstate", {
				state: nextState,
			});

			if (nextState.create) nextState.create();
		}

		/* enter new state */

		if (this.current) {
			this.trigger("leavestate", {
				prev: this.current,
				next: nextState,
				state: this.current,
			});
		}

		this.trigger("enterstate", {
			prev: this.current,
			next: nextState,
			state: nextState,
		});

		this.current = nextState;

		if (this.current && this.current.enter) {
			this.current.enter();
		}

		this.app.currentState = this.current;

		this.next = false;
	}
}

export default States;
