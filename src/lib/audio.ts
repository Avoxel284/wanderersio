class SoundOnDemand {
	path = "sounds/";
	static Channel: (engine: any) => void;

	constructor(options: any) {
		options = options || {};
		var canPlayMp3 = new Audio().canPlayType("audio/mp3");
		var canPlayOgg = new Audio().canPlayType('audio/ogg; codecs="vorbis"');
		if (this.preferedAudioFormat === "mp3") {
			if (canPlayMp3) this.audioFormat = "mp3";
			else this.audioFormat = "ogg";
		} else {
			if (canPlayOgg) this.audioFormat = "ogg";
			else this.audioFormat = "mp3";
		}
		this.audioContext = options.audioContext || new AudioContext();
		this.gainNode = this.audioContext.createGain();
		this.gainNode.connect(this.audioContext.destination);
		this.input = this.gainNode;
		this.gainNode.gain.value = 1.0;
		this.buffers = {};
		this.channels = {};
		this.aliases = {};
		var lastTick = Date.now();
		var engine = this;
		setInterval(function () {
			var delta = (Date.now() - lastTick) / 1000;
			lastTick = Date.now();
			engine.step(delta);
		}, 1000 / 30);
	}

	channel(name) {
		if (!this.channels[name]) this.channels[name] = new SoundOnDemand.Channel(this);
	}
}

SoundOnDemand.Channel = function (engine) {
	this.engine = engine;
	this.audioContext = engine.audioContext;
	this.gainNode = this.audioContext.createGain();
	this.convolverWetNode = this.audioContext.createGain();
	this.convolverDryNode = this.audioContext.createGain();
	this.convolverEnabled = false;
	this.compressorEnabled = true;
	this.route();
	this.queue = [];
	this.concurentSounds = 0;
	this.soundsThisStep = 0;
};

export default SoundOnDemand;
