PLAYGROUND.GameLoop = function (app) {
	app.lifetime = 0;
	app.ops = 0;
	app.opcost = 0;

	var lastTick = Date.now();
	var frame = 0;

	function render(delta) {
		app.emitGlobalEvent("prerender", delta);
		app.emitGlobalEvent("render", delta);
		app.emitGlobalEvent("postrender", delta);
	}

	function step(delta) {
		app.emitGlobalEvent("step", delta);
	}

	function gameLoop() {
		if (app.killed) return;

		requestAnimationFrame(gameLoop);

		if (app.frameskip) {
			frame++;
			if (frame === app.frameskip) {
				frame = 0;
			} else return;
		}

		var delta = Date.now() - lastTick;

		lastTick = Date.now();

		if (delta > 1000) return;

		var dt = delta / 1000;

		app.lifetime += dt;
		app.elapsed = dt;

		// app.emitLocalEvent("framestart", dt);

		step(dt);

		// app.emitLocalEvent("framemid", dt);

		render(dt);

		// app.emitLocalEvent("frameend", dt);

		app.opcost = delta / 1000;
		app.ops = 1000 / app.opcost;
	}

	requestAnimationFrame(gameLoop);
};
