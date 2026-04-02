/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import Ease from "./Ease";
import Events from "./Events";
import Loader from "./Loader";
import States from "./States";
import { throttle } from "./Util";

class Application extends Events {
	killed = false;
	dataSource = {};
	events = new Events();
	states: States;
	currentState: any;

	background = "#272822";
	smoothing = 1;
	paths: { base: string; images: string; fonts: string; rewrite: any; rewriteURL: any } = {
		base: "",
		images: "images/",
		fonts: "fonts/",
		rewrite: {},
		rewriteURL: {},
	};
	offsetX = 0;
	offsetY = 0;
	skipEvents = false;
	disabledUntilLoaded = true;
	mouseThrottling = 15;

	autoWidth = false;
	autoHeight = false;
	autoScale = false;

	width: number = 0;
	height: number = 0;
	scale: number = 0;

	container: any;
	ease: typeof Ease;
	loader: Loader;
	plugins: any[] = [];

	center: { x: number; y: number } = { x: 0, y: 0 };

	images = {};
	data = {};
	atlases = {};

	constructor(args: any) {
		// let app = this;
		super();

		// this.mouse = new Mouse();-
		// this.mouse

		this.ease = Ease;

		this.autoWidth = this.width ? false : true;
		this.autoHeight = this.height ? false : true;
		this.autoScale = this.scale ? false : true;

		if (!this.container) this.container = document.body;
		if (typeof this.container === "string") this.container = document.querySelector(this.container);

		if (args.background !== false) this.container.style.background = this.background;

		this.updateSize();

		this.states = new States(this);
		this.states.on("event", this.emitLocalEvent, this);

		window.addEventListener("storage", this.handleLocalStorage.bind(this));

		/* video recorder */

		// this.videoRecorder = new PLAYGROUND.VideoRecorder(this);

		/* sound */

		PLAYGROUND.Sound(this);

		/* visibility API */

		document.addEventListener("visibilitychange", () => this.handleVisibilityChange(document.hidden));

		window.addEventListener("blur", (ev) => {
			this.emitGlobalEvent("blur", {});
		});
		window.addEventListener("focus", (ev) => {
			this.emitGlobalEvent("focus", {});
		});

		this.on("resize", () => this.handleResize());
		window.addEventListener("resize", () => {
			throttle(this.handleResize.bind(this), 100);
		});

		this.loader = new Loader(this);
		this.pointer = new Pointer

		for (var key in PLAYGROUND) {
			var property = PLAYGROUND[key];

			if (property.plugin) this.plugins.push(new property(this));
		}

		/* flow */

		this.emitLocalEvent("preload");

		this.firstBatch = true;

		if (this.disabledUntilLoaded) this.skipEvents = true;

		function onPreloadEnd() {
			app.loadFoo(0.25);

			/* run everything in the next frame */

			setTimeout(function () {
				app.emitLocalEvent("create");

				app.setState(PLAYGROUND.DefaultState);
				app.handleResize();

				if (PLAYGROUND.LoadingScreen) app.setState(PLAYGROUND.LoadingScreen);

				/* game loop */

				PLAYGROUND.GameLoop(app);

				/* stage proper loading step */

				app.loader.once("ready", function () {
					app.firstBatch = false;

					if (app.disabledUntilLoaded) app.skipEvents = false;

					app.setState(PLAYGROUND.DefaultState);

					app.emitLocalEvent("ready");
					app.handleResize();
				});
			});
		}

		this.loader.once("ready", onPreloadEnd);
	}

	getOffset() {
		let offsetX = 0;
		let offsetY = 0;

		// this.container TBD --> might be actual canvas element
		do {
			offsetX += this.container.offsetLeft;
			offsetY += this.container.offsetTop;
		} while (this.container == this.container.offsetParent);

		return {
			x: offsetX,
			y: offsetY,
		};
	}

	get isCustomContainer() {
		return this.container !== document.body;
	}

	emitLocalEvent(event: string, data: any) {
		this.emit(event, data);
	}

	emitGlobalEvent(event: string, data: any) {
		if (!this.currentState) return this.emitLocalEvent(event, data);

		this.emit(event, data);

		if (this.state.event) this.state.event(event, data);

		if (this.state[event]) this.state[event](data);

		this.emit("after" + event, data);
	}

	setState(state: string) {
		this.states.set(state);
	}

	rewriteURL(url: string) {
		return this.paths.rewriteURL[url] || url;
	}

	handleLocalStorage(v: any) {
		this.emitGlobalEvent("localstorage", v);
	}

	updateSize() {
		if (this.customContainer) {
			var containerWidth = this.container.offsetWidth;
			var containerHeight = this.container.offsetHeight;
		} else {
			var containerWidth = window.innerWidth;
			var containerHeight = window.innerHeight;
		}

		if (!this.autoScale && !this.autoWidth && !this.autoHeight) {
		} else if (!this.autoHeight && this.autoWidth) {
			if (this.autoScale) this.scale = containerHeight / this.height;

			this.width = Math.ceil(containerWidth / this.scale);
		} else if (!this.autoWidth && this.autoHeight) {
			if (this.autoScale) this.scale = containerWidth / this.width;

			this.height = Math.ceil(containerHeight / this.scale);
		} else if (this.autoWidth && this.autoHeight && this.autoScale) {
			this.scale = 1;
			this.width = containerWidth;
			this.height = containerHeight;
		} else if (this.autoWidth && this.autoHeight) {
			this.width = Math.ceil(containerWidth / this.scale);
			this.height = Math.ceil(containerHeight / this.scale);
		} else {
			this.scale = Math.min(containerWidth / this.width, containerHeight / this.height);
		}

		this.offsetX = ((containerWidth - this.width * this.scale) / 2) | 0;
		this.offsetY = ((containerHeight - this.height * this.scale) / 2) | 0;

		this.center = {
			x: (this.width / 2) | 0,
			y: (this.height / 2) | 0,
		};
	}

	handleResize() {
		this.updateSize();

		// let { x, y } = this.getOffset();
		// this.offsetX = x;
		// this.offsetY = y;

		// this.emitGlobalEvent("beforeresize", {});

		this.emitGlobalEvent("resize", {});
	}

	handleVisibilityChange(hidden: boolean) {
		this.emitGlobalEvent("visibilitychange", {
			visible: !hidden,
			hidden: hidden,
		});
	}
}

export default Application;
