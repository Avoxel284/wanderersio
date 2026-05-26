/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import cq from "./CanvasQuery";
import { DefaultState } from "./DefaultState";
import Ease from "./Ease";
import Events from "./Events";
import GameLoop from "./GameLoop";
import Keyboard from "./Keyboard";
import CanvasLayer from "./Layer";
import Loader from "./Loader";
import LoadingScreen from "./LoadingScreen";
import Mouse from "./Mouse";
import Pointer from "./Pointer";
import Sound from "./Sound";
import type SoundAudio from "./SoundAudio";
import { SoundOnDemand, SoundOnDemandChannel, SoundOnDemandSound } from "./SoundOnDemand";
import States from "./States";
import Touch from "./Touch";
import Transitions from "./Transitions";
import { TweenManager } from "./TweenManager";
import { sprintf, throttle } from "./Util";

class Application extends Events {
	killed = false;
	dataSource: any = {};
	events = new Events();
	states: States;
	currentState: any;

	background = "#272822";
	smoothing = 1;
	paths: {
		base: string;
		images: string;
		fonts: string;
		rewrite: any;
		rewriteURL: any;
		[x: string]: any;
	} = {
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
	loader: Loader;
	pointer: Pointer;
	mouse: Mouse;
	touch: Touch;
	keyboard: Keyboard;
	transitions: Transitions;
	layers: CanvasLayer;
	sound: Sound;
	tween: TweenManager;
	gameLoop: GameLoop;

	center: { x: number; y: number } = { x: 0, y: 0 };

	images: { [url: string]: any } = {};
	data = {};
	atlases = {};
	audio: SoundOnDemand;
	firstBatch: boolean;
	state: any;
	customContainer = false;
	frameskip: any;
	screenshot: any;
	layer: any;
	transition: "IMPLODE" | "SPLIT" | null = null;
	transitionDuration: any;
	purgeCache = false;
	fontStyleSheet: any;

	private _imageLoaders: any;
	private _fontPromises: any = {};

	constructor(args: any) {
		// let app = this;
		super();

		// this.mouse = new Mouse();-
		// this.mouse

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
		this.gameLoop = new GameLoop(this);
		this.tween = new TweenManager(this);
		this.touch = new Touch(this);
		this.pointer = new Pointer(this);
		this.mouse = new Mouse(this);
		this.keyboard = new Keyboard(this);

		// plugins
		this.audio = new SoundOnDemand();
		this.transitions = new Transitions(this);
		this.layers = new CanvasLayer(this);
		this.sound = new Sound(this);

		this.emitLocalEvent("preload");

		this.firstBatch = true;
		if (this.disabledUntilLoaded) this.skipEvents = true;
		this.loader.once("ready", () => this.onPreloadEnd());
	}

	onPreloadEnd() {
		let app = this;

		setTimeout(function () {
			app.emitLocalEvent("create");

			app.setState(DefaultState);
			app.handleResize();

			if (LoadingScreen) app.setState(new LoadingScreen(app));

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

	emitLocalEvent(event: string, data?: any) {
		this.emit(event, data);
	}

	emitGlobalEvent(event: string, data: any) {
		if (!this.currentState) return this.emitLocalEvent(event, data);

		this.emit(event, data);

		if (this.state.event) this.state.event(event, data);

		if (this.state[event]) this.state[event](data);

		this.emit("after" + event, data);
	}

	setState(state: object) {
		this.states.set(state);
	}

	/**
	 * Compute a fully qualified path.
	 * `paths.base` is always prepended to the result.
	 * @param to A key in `paths` or a string (without ending `/`).
	 */
	getPath(to: string) {
		return this.paths.base + (this.paths[to] || to + "/");
	}

	rewriteURL(url: string) {
		return this.paths.rewriteURL[url] || url;
	}

	handleLocalStorage(v: any) {
		this.emitGlobalEvent("localstorage", v);
	}

	updateSize() {
		if (this.customContainer) {
			var containerWidth: number = this.container.offsetWidth;
			var containerHeight: number = this.container.offsetHeight;
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

	handleBlur(event: Event) {
		this.emitGlobalEvent("blur", {});
	}

	handleFocus(event: Event) {
		this.emitGlobalEvent("focus", {});
	}

	async request(url: string) {
		const baseUrl = url.split("?")[0];
		if (this.dataSource[baseUrl] != null) return { cachedBody: this.dataSource[baseUrl] };

		return await fetch(url, { method: "GET" });
	}

	insertAsset(asset: any, collection: any, path: any) {
		let pathArray = path.split("/");

		let current = collection;

		for (var i = 0; i < pathArray.length - 1; i++) {
			let segment = pathArray[i];

			if (!current[segment]) current[segment] = {};

			current = current[segment];
		}

		current[pathArray.pop()] = asset;

		collection[path] = asset;
	}

	getAssetEntry(
		path: string,
		folder: string,
		defaultExtension: string,
	): {
		/** Key to store */
		key: string;
		/** URL to load */
		url: string;
		/** URL without extension */
		path: string;
		/** Extension */
		ext: string;
		image?: any;
	} {
		let key;
		let url;
		let absolute = false;

		if (path[0] === "<") {
			absolute = true;

			let abslimit = path.indexOf(">");

			url = path.substr(1, abslimit - 1);
			key = path.substr(abslimit + 1).trim();
			path = url;

			url = this.rewriteURL(url);
		}

		var folder = /* this.paths[folder] || */ folder + "/";

		var fileinfo = path.match(/(.*)\..*/);

		if (!key) key = fileinfo ? fileinfo[1] : path;

		var temp = path.split(".");
		var basename = path;

		if (temp.length > 1) {
			var ext = temp.pop() || defaultExtension;
			path = temp.join(".");
		} else {
			var ext = defaultExtension;
			basename += "." + defaultExtension;
		}

		if (!url) url = this.rewriteURL(this.paths.base + folder + basename);

		return {
			key: key,
			url: url,
			path: this.paths.base + folder + path,
			ext: ext,
			image: null,
		};
	}

	/**
	 * Loads assets as data/JSON or text.
	 */
	loadData(...args: (string | { [name: string]: any })[]) {
		for (var i = 0; i < args.length; i++) {
			var arg = args[i];

			if (typeof arg === "object") {
				for (var key in arg) this.loadData(arg[key]);
			} else {
				this.loadDataItem(arg);
			}
		}
	}

	private async loadDataItem(name: string) {
		let entry = this.getAssetEntry(name, "data", "json");

		// this.loader.add();

		const res = await this.request(entry.url + (this.purgeCache ? "?" + Date.now() : ""));

		if (entry.ext === "json") {
			try {
				if (res instanceof Response) var data = JSON.parse(await res.json());
				else var data = JSON.parse(res.cachedBody);
			} catch (e) {
				console.error("JSON file corrupt " + name);

				return;
			}

			this.insertAsset(data, this.data, entry.key);
		} else {
			if (res instanceof Response) this.insertAsset(await res.text(), this.data, entry.key);
			else this.insertAsset(res.cachedBody, this.data, entry.key);
		}

		this.loader.success(entry.url);
	}

	loadImage(...args: string[]) {
		return this.loadImages.apply(this, args);
	}

	loadImages(...args: (string | any)[]) {
		let promises: Promise<any>[] = [];

		for (var i = 0; i < args.length; i++) {
			var arg = args[i];

			if (typeof arg === "object") {
				for (var key in arg) promises = promises.concat(this.loadImages(arg[key]));
			} else {
				promises.push(this.loadSingleImage(arg));
			}
		}

		return Promise.all(promises);
	}

	private loadSingleImage(name: string) {
		if (!this._imageLoaders) this._imageLoaders = {};

		let app = this;

		if (!this._imageLoaders[name]) {
			app._imageLoaders[name] = new Promise((res, rej) => {
				/* if argument is not an object/array let's try to load it */

				let loader = app.loader;
				let entry = app.getAssetEntry(name, "images", "png");

				app.loader.add(entry.url);

				let image = new Image();

				image.addEventListener("load", function () {
					app.images[entry.key] = image;

					res(image);
					loader.success(entry.url);

					entry.image = image;

					app.insertAsset(image, app.images, entry.key);

					app.emitLocalEvent("imageready", entry);
				});

				image.addEventListener("error", function () {
					rej("Failed to load " + entry.url);
					loader.error(entry.url);
				});

				image.src = entry.url;
			});
		}

		return this._imageLoaders[name];
	}

	loadFont(...args: any[]) {
		let promises = [];
		let app = this;

		for (var i = 0; i < args.length; i++) {
			let name = args[i];

			promises.push(
				(() => {
					if (!this.fontStyleSheet) {
						let style = document.createElement("style");
						document.head.appendChild(style);
						this.fontStyleSheet = style;
					}

					let entry = this.getAssetEntry(name, "fonts", "ttf");

					let format = {
						woff: "woff",
						otf: "opentype",
						ttf: "truetype",
					}[entry.ext];

					var raw =
						"@font-face { font-family: '{name}'; font-style: 'normal'; font-weight: 400, 800; src: url(fonts/{name}.{ext}) format('{format}'); }";

					var rule = sprintf(raw, {
						name: name,
						ext: entry.ext,
						format: format || "",
					});

					this.fontStyleSheet.innerHTML += rule;

					/* wait until font has been loaded */

					if (!this._fontPromises) this._fontPromises = {};

					if (!this._fontPromises[name]) {
						this._fontPromises[name] = new Promise<void>((res, rej) => {
							app.loader.add("font " + name);

							var checkingTimer = setInterval(function () {
								var base = cq(100, 32)
									.font("14px somethingrandom")
									.fillStyle("#fff")
									.textBaseline("top");
								base.context.fillText("lorem ipsum dolores sit", 0, 4);

								var test = cq(100, 32)
									.font("14px '" + name + "'")
									.fillStyle("#fff")
									.textBaseline("top");
								test.context.fillText("lorem ipsum dolores sit", 0, 4);

								if (!(cq as any).compare(base, test)) {
									app.loader.success("font" + name);

									clearInterval(checkingTimer);

									res();
								}
							}, 100);
						});
					}

					return this._fontPromises[name];
				})(),
			);
		}

		return Promise.all(promises);
	}

	render() {}

	enableInputs() {
		this.mouse.enabled = true;
		this.touch.enabled = true;
		this.keyboard.enabled = true;
	}

	disableInputs() {
		this.mouse.enabled = false;
		this.touch.enabled = false;
		this.keyboard.enabled = false;
	}
}

export default Application;
