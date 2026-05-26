/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import Events from "./Events";

/**
 * SoundOnDemand r1
 *
 * (c) 2012-2015 http://rezoner.net
 *
 * This library may be freely distributed under the MIT license.
 *
 * Options:
 * - output: output node, default
 * - audioContext: audioContext
 */

export class SoundOnDemand extends Events {
	static moveTo(fadeMod: number, fadeTarget: any, arg2: number): number {
		throw new Error("Method not implemented.");
	}
	preferredAudioFormat: "mp3" | "ogg" = "ogg";
	audioFormat: string;
	audioContext: any;
	compressor: any;
	gainNode: any;
	input: any;
	buffers: any = {};
	aliases: any = {};
	channels: { [channel: string]: SoundOnDemandChannel } = {};

	path = "sounds/";
	static Sound: any;
	static Channel: any;
	loaders: any;

	constructor(options: { audioContext: any } = { audioContext: null }) {
		super();
		var canPlayMp3 = new Audio().canPlayType("audio/mp3");
		var canPlayOgg = new Audio().canPlayType('audio/ogg; codecs="vorbis"');

		if (this.preferredAudioFormat === "mp3") {
			if (canPlayMp3) this.audioFormat = "mp3";
			else this.audioFormat = "ogg";
		} else {
			if (canPlayOgg) this.audioFormat = "ogg";
			else this.audioFormat = "mp3";
		}

		this.audioContext = options.audioContext || new AudioContext();

		this.compressor = this.audioContext.createDynamicsCompressor();
		this.compressor.connect(this.audioContext.destination);

		this.gainNode = this.audioContext.createGain();
		this.gainNode.connect(this.compressor);

		this.input = this.gainNode;

		this.gainNode.gain.value = 1.0;

		this.buffers = {};

		this.channels = {};
		this.aliases = {};

		var lastTick = Date.now();
		var engine = this;

		setInterval(function () {
			var delta = (lastTick - Date.now()) / 1000;

			lastTick = Date.now();

			engine.step(delta);
		}, 1000 / 60);
	}

	step(delta: number) {
		throw new Error("Method not implemented.");
	}

	moveTo(value: number, target: number, step: number) {
		if (value < target) {
			value += step;
			if (value > target) value = target;
		}

		if (value > target) {
			value -= step;
			if (value < target) value = target;
		}

		return value;
	}

	channel(name: string) {
		if (!this.channels[name]) this.channels[name] = new SoundOnDemand.Channel(this);

		return this.channels[name];
	}

	load(key: string) {
		let engine = this;
		let entry = engine.getAssetEntry(key, engine.audioFormat);

		if (!this.loaders[key]) {
			this.loaders[key] = new Promise(function (resolve, reject) {
				if (engine.buffers[entry.key]) return resolve(engine.buffers[entry.key]);

				var request = new XMLHttpRequest();

				request.open("GET", entry.url, true);
				request.responseType = "arraybuffer";

				request.onload = function () {
					engine.audioContext.decodeAudioData(this.response, function (decodedBuffer: any) {
						console.log("decodedBuffer", decodedBuffer);
						engine.buffers[entry.key] = decodedBuffer;
						resolve(decodedBuffer);
					});
				};

				request.send();
			});
		}

		return this.loaders[key];
	}

	getAssetEntry(key: string, defaultExtension: string) {
		var fileinfo = this.path.match(/(.*)\..*/);
		var key = fileinfo ? fileinfo[1] : this.path;

		var temp = this.path.split(".");
		var basename = this.path;

		if (temp.length > 1) {
			var ext = temp.pop() || defaultExtension;
			this.path = temp.join(".");
		} else {
			var ext = defaultExtension;
			basename += "." + defaultExtension;
		}

		return {
			key: key,
			url: this.path + basename,
			path: this.path + this.path,
			ext: ext,
		};
	}
}

export class SoundOnDemandChannel {
	engine: any;
	audioContext: any;
	gainNode: any;
	convolverWetNode: any;
	convolverDryNode: any;
	convolverNode: any;
	convolverEnabled: boolean;
	queue: SoundOnDemandSound[];
	loops: never[];
	currentRoute: any;
	input: any;
	currentConvolverImpulse: any;

	constructor(engine: SoundOnDemand) {
		this.engine = engine;
		this.audioContext = engine.audioContext;

		/* connection order goes from bottom to top */

		/* gain node */

		this.gainNode = this.audioContext.createGain();

		/* convolver */

		this.convolverWetNode = this.audioContext.createGain();
		this.convolverDryNode = this.audioContext.createGain();
		this.convolverNode = this.audioContext.createConvolver();
		this.convolverEnabled = false;

		this.route();

		this.queue = [];
		this.loops = [];
	}

	xroute() {
		if (this.currentRoute) {
			for (var i = 0; i < this.currentRoute.length - 1; i++) {
				this.currentRoute[i].disconnect();
			}
		}

		this.currentRoute = [];

		for (var i = 0; i < arguments.length; i++) {
			if (i < arguments.length - 1) {
				var node = arguments[i];

				node.connect(arguments[i + 1]);
			}

			this.currentRoute.push(node);
		}

		this.input = arguments[0];
	}

	get(key: string) {
		return new SoundOnDemand.Sound(key, this);
	}

	play(key: string) {
		var sound = this.get(key);

		this.add(sound);

		return sound;
	}

	remove(sound: SoundOnDemandSound) {
		sound._remove = true;
	}

	add(sound: SoundOnDemandSound) {
		sound._remove = false;

		this.queue.push(sound);
	}

	step(delta: number) {
		/* process queue */

		for (var i = 0; i < this.queue.length; i++) {
			var sound = this.queue[i];

			sound.step(delta);

			if (sound._remove) this.queue.splice(i--, 1);
		}

		/* process sounds being played */
	}

	volume(value = 1) {
		this.gainNode.value = value;

		return this;
	}

	swapConvolver(key: string): Promise<void> {
		var engine = this.engine;
		var channel = this;

		return new Promise(function (res, rej) {
			if (channel.currentConvolverImpulse === key) {
				res();
			} else {
				engine.load(key).then(function (buffer: any) {
					channel.currentConvolverImpulse = key;
					channel.convolverNode.buffer = buffer;
					res();
				});
			}
		});
	}

	updateConvolverState(enabled = true) {
		this.convolverEnabled = enabled;
		this.route();
	}

	subroute(nodes: any) {
		for (var i = 0; i < nodes.length; i++) {
			if (i < nodes.length - 1) {
				var node = nodes[i];
				node.disconnect();
				node.connect(nodes[i + 1]);
			}
		}

		this.input = nodes[0];
	}

	route() {
		this.gainNode.disconnect();

		if (this.convolverEnabled) {
			this.gainNode.connect(this.convolverDryNode);

			this.gainNode.connect(this.convolverNode);
			this.convolverNode.connect(this.convolverWetNode);

			this.convolverWetNode.connect(this.engine.input);
			this.convolverDryNode.connect(this.engine.input);
		} else {
			this.gainNode.connect(this.engine.input);
		}

		this.input = this.gainNode;
	}

	convolver(value: any, key: string) {
		var enabled = value > 0;
		var channel = this;

		this.swapConvolver(key).then(function () {
			if (enabled !== channel.convolverEnabled) channel.updateConvolverState(enabled);
		});

		this.convolverWetNode.gain.value = value;
		this.convolverDryNode.gain.value = 1 - value;

		return this;
	}
}

export class SoundOnDemandSound {
	key: string;
	bufferKey: string;
	channel: SoundOnDemandChannel;
	audioContext: any;
	current = {
		volume: 1.0,
		rate: 1.0,
		pan: 1.0,
		loop: false,
	};
	fadeMod: number;

	alias = { volume: 1.0, rate: 1.0, source: "" };
	bufferSource: any;
	gainNode: any;
	panNode: any;
	ready: any;
	playing = false;
	buffer: any;
	currentTime = 0;
	fadeTarget = 0;
	fadeSpeed = 0;
	fadeTime = 0;
	fadeDuration: any;
	_remove = false;

	constructor(key: string, channel: SoundOnDemandChannel) {
		this.key = key;
		this.bufferKey = key;

		if (channel.engine.aliases[key]) {
			this.alias = channel.engine.aliases[key];

			this.bufferKey = this.alias.source;
		}

		if (!channel.engine.buffers[this.bufferKey]) channel.engine.load(this.bufferKey);

		this.channel = channel;
		this.audioContext = this.channel.engine.audioContext;

		this.fadeMod = 1.0;

		this.createNodes();
	}

	createNodes() {
		let bufferSource = this.audioContext.createBufferSource();
		let gainNode = this.audioContext.createGain();
		let panNode = this.audioContext.createStereoPanner();

		bufferSource.connect(panNode);
		panNode.connect(gainNode);
		gainNode.connect(this.channel.input);

		this.bufferSource = bufferSource;
		this.gainNode = gainNode;
		this.panNode = panNode;
	}

	volume(volume: number) {
		volume *= this.alias.volume;
		this.current.volume = volume;
		this.updateVolume();

		return this;
	}

	updateVolume() {
		this.gainNode.gain.value = this.current.volume * this.fadeMod;
	}

	pan(pan: number) {
		this.current.pan = pan;

		this.updatePanning();

		return this;
	}

	updatePanning() {
		this.panNode.pan.value = this.current.pan;
	}

	loop(loop = true) {
		this.bufferSource.loop = loop;
		this.current.loop = loop;

		return this;
	}

	rate(rate: number) {
		rate *= this.alias.rate;

		this.bufferSource.playbackRate.value = rate;

		this.current.rate = rate;

		return this;
	}

	onended() {
		if (!this.current.loop) this.stop();
	}

	step(delta: number) {
		if (!this.ready) {
			if (!this.channel.engine.buffers[this.bufferKey]) return;

			this.ready = true;
			this.playing = true;

			this.buffer = this.channel.engine.buffers[this.bufferKey];

			this.bufferSource.buffer = this.buffer;

			this.bufferSource.start(0);
			this.bufferSource.onended = this.onended.bind(this);

			this.currentTime = 0;
		}

		this.currentTime += this.bufferSource.playbackRate.value * delta;

		if (this.fadeTarget !== this.fadeMod) {
			this.fadeMod = SoundOnDemand.moveTo(this.fadeMod, this.fadeTarget, delta * this.fadeSpeed);

			this.updateVolume();
		} else if (this.fadeTarget === 0) {
			this.pause();
		}
	}

	pause() {
		this.channel.remove(this);
		this.bufferSource.stop(0);
		this.playing = false;
	}

	stop() {
		this.channel.remove(this);
		this.bufferSource.stop(0);
		this.playing = false;
	}

	resume() {
		this.createNodes();
		this.bufferSource.buffer = this.buffer;

		this.currentTime = this.currentTime % this.buffer.duration;
		this.bufferSource.start(0, this.currentTime);

		this.rate(this.current.rate);
		this.volume(this.current.volume);
		this.loop(this.current.loop);

		this.channel.add(this);

		this.playing = true;
	}

	fadeTo(target: any, duration: any) {
		if (!this.playing) this.resume();

		duration = duration || 1.0;

		this.fadeTime = 0;
		this.fadeTarget = target;
		this.fadeDuration = duration;
		this.fadeSpeed = Math.abs(target - this.fadeMod) / duration;

		return this;
	}

	fadeIn(duration: number) {
		if (!this.playing) this.resume();

		this.fadeTo(1.0, duration);

		return this;
	}

	fadeOut(duration: number) {
		this.fadeTo(0, duration);

		return this;
	}
}
