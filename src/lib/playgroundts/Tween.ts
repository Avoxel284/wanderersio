/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import type Application from "./Application";
import cq from "./CanvasQuery";
import ease from "./Ease";
import Ease from "./Ease";
import Events from "./Events";
import type { TweenManager } from "./TweenManager";
import { circWrap } from "./Util";

type Action = [string, number | string, any];
enum ActionType {
	NUMBER = 0,
	COLOR = 1,
	ANGLE = 2,
}

class Tween extends Events {
	manager: any;
	context: any;
	auto = true;
	prevEasing = "linear";
	prevDuration = 0.5;
	actions: Action[] = [];
	index = -1;
	current: Action | null = null;
	loop = false;
	delta = 0;
	finished = false;
	duration = 0;
	looped: any;
	currentAction?: string;
	keys: string[] = [];
	change: any[] = [];
	before: any[] = [];
	types: ActionType[] = [];
	easing: any;
	progress: number = 0;

	_remove = false;

	constructor(manager: TweenManager, context: any) {
		super();
		this.manager = manager;
		this.context = context;
		this.clear();
	}

	manual() {
		this.auto = false;
		return this;
	}

	clear() {
		this.actions = [];
		this.index = -1;
		this.current = null;
	}

	add(properties: any, duration: number, easing: any) {
		if (typeof duration !== "undefined") this.prevDuration = duration;
		else duration = 0.5;

		if (easing) this.prevEasing = easing;
		else easing = "linear";

		this.actions.push([properties, duration, easing]);

		return this;
	}

	discard() {
		this.manager.discard(this.context, this);
		return this;
	}

	to(properties: any, duration: number, easing: any) {
		return this.add(properties, duration, easing);
	}

	call(methodName: string, context: any) {
		let action: Action = ["call", methodName, context || this.context];

		for (var i = 2; i < arguments.length; i++) action.push(arguments[i]);

		this.actions.push(action);

		return this;
	}

	repeat(count: number) {
		this.actions.push(["repeat", count, null]);
		return this;
	}

	delay(ms: number) {
		this.actions.push(["delay", ms, null]);
		return this;
	}

	stop() {
		this.manager.remove(this);
		return this;
	}

	play() {
		this.manager.add(this);
		this.finished = false;
		return this;
	}

	end() {
		let lastAnimationIndex = 0;

		for (let i = this.index + 1; i < this.actions.length; i++) {
			if (typeof this.actions[i][0] === "object") lastAnimationIndex = i;
		}

		this.index = lastAnimationIndex - 1;
		this.next();
		this.delta = this.duration;
		this.step(0);

		return this;
	}

	step(delta: number) {
		this.delta += delta;

		if (!this.current) this.next();

		switch (this.currentAction) {
			case "animate":
				this.doAnimate(delta);
				break;

			case "wait":
				this.doWait(delta);
				break;
		}
	}

	/**
	 * Perform one animation step.
	 *
	 * Advances the index and, if the index reached the end of the
	 * `actions` array, either restarts it (for looped tweens) or terminates it.
	 *
	 * The function will set a string in `currentAction` indicating what it
	 * should be done next but it does not perform the action itself.
	 */
	next() {
		this.delta = 0;

		this.index++;

		if (this.index >= this.actions.length) {
			if (this.looped) {
				this.trigger("loop", {
					tween: this,
				});

				this.index = 0;
			} else {
				this.manager.remove(this);

				return;
			}
		}

		this.current = this.actions[this.index];

		if (this.current[0] === "call") {
			var args = this.current.slice(2);

			var methodName = this.current[1];
			var context = this.current[2];
			var method = context[methodName];

			method.apply(context, args);
		} else if (this.current[0] === "delay") {
			this.duration =
				typeof this.current[1] == "string" ? parseFloat(this.current[1]) : this.current[1];
			this.currentAction = "delay";
		} else if (typeof this.current[0] === "object") {
			let properties: any = this.current[0];
			this.keys = Object.keys(properties);

			this.change = [];
			this.before = [];
			this.types = [];

			for (var i = 0; i < this.keys.length; i++) {
				let key = this.keys[i];
				let value = this.context[key];

				if (typeof properties[key] === "number") {
					value = value || 0;

					this.before.push(value);
					this.change.push(properties[key] - value);
					this.types.push(0);
				} else if (typeof properties[key] === "string" && properties[key].indexOf("rad") > -1) {
					value = value || 0;

					this.before.push(value);
					this.change.push(
						PLAYGROUND.Utils.circWrappedDistance(value, parseFloat(properties[key])),
					);
					this.types.push(2);
				} else {
					value = value || "#000";

					var before = (cq as any).color(value);

					this.before.push(before);

					var after = (cq as any).color(properties[key]);

					var temp = [];

					for (var j = 0; j < 3; j++) {
						temp.push(after[j] - before[j]);
					}

					this.change.push(temp);

					this.types.push(1);
				}
			}

			this.currentAction = "animate";

			this.duration =
				typeof this.current[1] === "string" ? parseFloat(this.current[1]) : this.current[1];
			this.easing = this.current[2];
		}
	}

	doAnimate(delta: number) {
		this.progress = this.duration ? Math.min(1, this.delta / this.duration) : 1.0;

		let mod = ease(this.progress, this.easing);

		for (var i = 0; i < this.keys.length; i++) {
			var key = this.keys[i];

			switch (this.types[i]) {
				case ActionType.NUMBER:
					this.context[key] = this.before[i] + this.change[i] * mod;

					break;

				case ActionType.COLOR:
					let change = this.change[i];
					let before = this.before[i];
					let color = [];

					for (var j = 0; j < 3; j++) {
						color.push((before[j] + change[j] * mod) | 0);
					}

					this.context[key] = "rgb(" + color.join(",") + ")";

					break;

				case ActionType.ANGLE:
					this.context[key] = circWrap(this.before[i] + this.change[i] * mod);

					break;
			}
		}

		if (this.progress >= 1) this.next();
		if (this.listeners["step"]) {
			this.trigger("step", {
				tween: this,
				dt: delta,
			});
		}
	}

	/**
	 * Advances through the animation if enough time has passed.
	 */
	doWait(delta: number) {
		if (this.delta >= this.duration) this.next();
	}

	onRemove() {
		this.trigger("finished", {
			tween: this,
		});

		this.trigger("finish", {
			tween: this,
		});

		this.finished = true;
	}
}

export default Tween;
