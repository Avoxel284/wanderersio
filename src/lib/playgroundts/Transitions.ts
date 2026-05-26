/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import type Application from "./Application";
import ease from "./Ease";

class Transitions {
	app: Application;
	screenshot: any;
	lifetime = 0;
	progress = 0;

	constructor(app: Application) {
		this.app = app;

		app.on("enterstate", (eventName: string, data) => {
			this.app.screenshot = this.screenshot = this.app.layer.cache();

			if (data.prev) {
				this.lifetime = 0;
				this.progress = 0;
			}
		});

		app.on("afterpostrender", (eventName, data) => {
			if (this.progress >= 1) return;
			if (this.app.transition == "IMPLODE") this.implode();
			else if (this.app.transition == "SPLIT") this.split();
		});

		app.on("step", (eventName: string, delta: number) => {
			if (this.progress >= 1) return;

			this.lifetime += delta;

			this.progress = Math.min(this.lifetime / this.app.transitionDuration, 1);
		});
	}

	implode() {
		let progress = ease(this.progress, "outCubic");
		let inverse = 1 - progress;

		this.app.layer.save();
		this.app.layer.tars(this.app.center.x, this.app.center.y, 0.5, 0.5, 0, 0.5 + 0.5 * inverse, inverse);
		this.app.layer.drawImage(this.screenshot, 0, 0);

		this.app.layer.restore();
	}

	split() {
		let progress = ease(this.progress, "inOutCubic");
		let inverse = 1 - progress;

		this.app.layer.save();

		this.app.layer.a(inverse).clear("#fff").ra();

		this.app.layer.drawImage(
			this.screenshot,
			0,
			0,
			this.app.width,
			(this.app.height / 2) | 0,
			0,
			0,
			this.app.width,
			((inverse * this.app.height) / 2) | 0,
		);
		this.app.layer.drawImage(
			this.screenshot,
			0,
			(this.app.height / 2) | 0,
			this.app.width,
			(this.app.height / 2) | 0,
			0,
			(this.app.height / 2 + (progress * this.app.height) / 2 + 1) | 0,
			this.app.width,
			Math.max(1, (inverse * this.app.height * 0.5) | 0),
		);

		this.app.layer.restore();
	}
}

export default Transitions;
