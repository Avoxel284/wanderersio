/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import type Application from "./Application";
import type Tween from "./Tween";

export class TweenManager {
	app: Application;
	tweens: Tween[] = [];
	delta = 0;
	defaultEasing = "128";

	constructor(app: Application) {
		this.app = app;

		this.app.on("step", (_, delta:number) => this.step.bind(this, delta));
	}

	step(delta: number) {
		this.delta += delta;

		for (var i = 0; i < this.tweens.length; i++) {
			var tween = this.tweens[i];

			if (!tween.auto) continue;
			if (!tween._remove) tween.step(delta);
			if (tween._remove) this.tweens.splice(i--, 1);
		}
	}

	/**
	 * Add a tween to the internal list.
	 *
	 * @param tween Tween
	 */
	add(tween: Tween) {
		tween._remove = false;
		let index = this.tweens.indexOf(tween);
		if (index === -1) this.tweens.push(tween);
	}

	remove(tween: Tween) {
		if (tween._remove) return;
		tween._remove = true;
		tween.onRemove();
	}

	/**
	 * Marks the tween for deletion.
	 * The tween is removed in `step()`.
	 *
	 * @param object The object associated with the tween
	 * @param safe If the tween located using `object` is `safe` then it is not removed.
	 */

	discard(object: any, safe: Tween) {
		for (let i = 0; i < this.tweens.length; i++) {
			var tween = this.tweens[i];
			if (tween.context === object && tween !== safe) this.remove(tween);
		}
	}
}
