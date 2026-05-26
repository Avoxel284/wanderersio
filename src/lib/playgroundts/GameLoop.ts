/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import type Application from "./Application";

class GameLoop {
	app: Application;
	lifetime = 0;
	ops = 0;
	opcost = 0;
	frame = 0;
	lastTick = Date.now();
	elapsed = 0;

	constructor(app: Application) {
		this.app = app;

		requestAnimationFrame(this.onAnimFrame);
	}

	render(delta: number) {
		this.app.emitGlobalEvent("prerender", delta);
		this.app.emitGlobalEvent("render", delta);
		this.app.emitGlobalEvent("postrender", delta);
	}

	step(delta: number) {
		this.app.emitGlobalEvent("step", delta);
	}

	private onAnimFrame() {
		if (this.app.killed) return;

		requestAnimationFrame(this.onAnimFrame);

		if (this.app.frameskip) {
			this.frame++;
			if (this.frame === this.app.frameskip) {
				this.frame = 0;
			} else return;
		}

		var delta = Date.now() - this.lastTick;

		this.lastTick = Date.now();

		if (delta > 1000) return;

		var dt = delta / 1000;

		this.lifetime += dt;
		this.elapsed = dt;

		// app.emitLocalEvent("framestart", dt);

		this.step(dt);

		// app.emitLocalEvent("framemid", dt);

		this.render(dt);

		// app.emitLocalEvent("frameend", dt);

		this.opcost = delta / 1000;
		this.ops = 1000 / this.opcost;
	}
}

export default GameLoop;
