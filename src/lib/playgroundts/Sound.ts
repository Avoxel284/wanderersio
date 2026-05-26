/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import type Application from "./Application";
import SoundAudio from "./SoundAudio";

/**
 * Audio API class. Provides two layers, `music` and `sound`.
 */
class Sound {
	app: Application;
	sound: SoundAudio;
	music: SoundAudio;

	constructor(app: Application) {
		this.app = app;
		this.sound = new SoundAudio(app);
		this.music = new SoundAudio(app);
	}

	playSound(key: any, loop = false) {
		return this.sound.play(key, loop);
	}

	stopSound(sound: any) {
		this.sound.stop(sound);
	}

	loadSound(...sounds: any[]) {
		return this.loadSounds.apply(this, sounds);
	}

	loadSounds(...sounds: any[]) {
		for (var i = 0; i < sounds.length; i++) {
			var arg = sounds[i];

			/* polymorphism at its finest */
			// oh god

			if (typeof arg === "object") {
				for (var key in arg) this.loadSounds(arg[key]);
			} else {
				this.sound.load(arg);
			}
		}
	}
}

export default Sound;
