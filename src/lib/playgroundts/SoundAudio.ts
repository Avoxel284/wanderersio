/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import type Application from "./Application";

/**
 * Sound back-end using HTML DOM Audio object
 */
class SoundAudio {
	app: Application;
	samples: { [file: string]: any } = {};
	volume = 1;
	audioFormat: "mp3" | "ogg" = "ogg";

	constructor(app: Application) {
		this.app = app;

		let canPlayMp3 = new Audio().canPlayType("audio/mp3");
		let canPlayOgg = new Audio().canPlayType('audio/ogg; codecs="vorbis"');

		// if (this.app.preferredAudioFormat === "mp3") {
		// 	if (canPlayMp3) this.audioFormat = "mp3";
		// 	else this.audioFormat = "ogg";
		// } else {
		// 	if (canPlayOgg) this.audioFormat = "ogg";
		// 	else this.audioFormat = "mp3";
		// }
	}

	setMaster(volume: number) {
		this.volume = volume;
	}

	load(file: string) {
		var url = "sounds/" + file + "." + this.audioFormat;

		var loader = this.app.loader;

		this.app.loader.add(url);

		var audio = (this.samples[file] = new Audio());

		audio.addEventListener("canplay", function () {
			console.log("CANPLAY");

			this.pause();
			loader.success(url);
		});
		/*
        audio.addEventListener("canplaythrough", function() {

          console.log("CANPLAYTHROUGH");

          loader.success(url);

        });

        audio.addEventListener("load", function() {

          console.log("LOAD");

          loader.success(url);

        });
    */
		audio.addEventListener("error", function () {
			loader.error(url);
		});

		audio.src = url;
		audio.play();
	}

	play(key: string, loop = false) {
		var sound = this.samples[key];

		sound.currentTime = 0;
		sound.loop = loop;
		sound.play();

		return sound;
	}

	stop(what: any) {
		if (!what) return;

		what.pause();
	}

	step(delta: any) {}

	setPlaybackRate(sound: string, rate: number) {
		throw "Not implemented >w<";
	}

	setVolume(sound: any, volume: number) {
		sound.volume = volume * this.volume;
	}

	setPosition() {}

	setPanning(sound: string, pan: number) {}
}

export default SoundAudio;
