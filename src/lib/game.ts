class Game {
	walls: WallSystem;
	obstacles: ObstacleSystem;
	data: {};
	needRefreshMap: boolean;
	groundColor: any;
	inputMode: string;
	quickChat: QuickChat;
	nextTribesmanPosition: null;
	pointer: { x: number; y: number; alert: null; entity: null };
	cursorDirection: number;
	cursorFinalDirection: number;
	manipulators: never[];
	socket: WebSocket;
	server_url: any;
	onconnect: any;
	onmessage: any;
	ondisconnect: any;
	timeouts: never[];
	gui: GUI;
	guiElements: {};
	cursor: any;
	action: GameActionManager;
	selector: Selector;
	tooltip: any;
	orders: never[];
	clearOrderTimeout: number;
	left: number;
	top: number;
	right: number;
	bottom: number;
	entities: any;
	width: number;
	height: number;
	mapScaleX: number;
	mapScaleY: number;
	mapTexture: any;
	soundButton: any;
	musicButton: any;
	buttons: never[];
	experienceBottle: any;
	guiResources: any;
	panels: { left: never[]; right: never[]; bottom: never[]; };
	onActionButtonClick: any;

	enter() {
		this.walls = new NAMESPACE.WallSystem(this);
		this.obstacles = new NAMESPACE.ObstacleSystem(this);
		$(app.canvas).addClass("cursor-none");
		this.data = {};
		this.needRefreshMap = true;
		gtag("event", "gameenter");
		this.groundColor = Utils.intToRGBA(COMMON.GROUND_COLOR);
		this.inputMode = "default";
		this.quickChat = new CLIENT.QuickChat();
		this.nextTribesmanPosition = null;
		this.pointer = { x: 0, y: 0, alert: null, entity: null };
		this.cursorDirection = 0;
		this.cursorFinalDirection = 0;
		this.manipulators = [];
		if ($_HASH["server"]) {
			this.socket = new WebSocket($_HASH["server"]);
		} else {
			this.socket = new WebSocket(`wss://${this.server_url}.wanderers.io`);
		}
		this.socket.binaryType = "arraybuffer";
		this.socket.addEventListener("open", this.onconnect.bind(this));
		this.socket.addEventListener("message", this.onmessage.bind(this));
		this.socket.addEventListener("close", this.ondisconnect.bind(this));
		this.timeouts = [];
		this.gui = new CLIENT.GUI();
		this.guiElements = {};
		this.cursor = new CLIENT.Sprite();
		this.cursor.prefix = "cursor/";
		this.cursor.set("point");
		this.action = new CLIENT.GameActionManager(this, CLIENT.Game.Actions);
		this.action.set("none");
		this.selector = new CLIENT.Selector(this);
		this.tooltip = this.gui.add("Text");
		this.tooltip.font = app.fonts.default;
		this.showTooltip("test");
		this.hideTooltip();
		this.orders = [];
		this.clearOrderTimeout = COMMON.CLEAR_ORDER_INTERVAL;
	}
	showTooltip(arg0: string) {
		throw new Error("Method not implemented.");
	}
	hideTooltip() {
		throw new Error("Method not implemented.");
	}

	updateBorder() {
		this.left = +Infinity;
		this.top = +Infinity;
		this.right = -Infinity;
		this.bottom = -Infinity;
		for (let meadow of this.entities.groups.meadows) {
			if (meadow.x < this.left) this.left = meadow.x;
			if (meadow.x > this.right) this.right = meadow.x;
			if (meadow.y < this.top) this.top = meadow.y;
			if (meadow.y > this.bottom) this.bottom = meadow.y;
		}
		this.left -= COMMON.BORDER;
		this.top -= COMMON.BORDER;
		this.right += COMMON.BORDER;
		this.bottom += COMMON.BORDER;
		this.width = Math.abs(this.left - this.right);
		this.height = Math.abs(this.top - this.bottom);
	}

	updateMapTexture() {
		this.updateBorder();
		let mapWidth = 64;
		let mapHeight = 64;
		let scaleX = mapWidth / this.width;
		let scaleY = mapHeight / this.height;
		this.mapScaleX = scaleX;
		this.mapScaleY = scaleY;
		let map = cq(mapWidth, mapHeight);
		map.smoothing = false;
		for (let meadow of this.entities.groups.meadows) {
			let x = meadow.x - this.left;
			let y = meadow.y - this.top;
			if (meadow.team === -1) {
				map.fillStyle("#638538");
			} else {
				map.fillStyle(Utils.hexToString(COMMON.TEAM_COLOR[meadow.team].mid));
			}
			map.save();
			map.translate(x * scaleX, y * scaleY);
			map.fillCircle(0, 0, (1 + meadow.radius * scaleX) | 0);
			map.restore();
		}
		for (let entity of this.entities.groups.buildings) {
			let x = entity.x - this.left;
			let y = entity.y - this.top;
			map.fillStyle(Utils.hexToString(COMMON.TEAM_COLOR[entity.shared.team].mid));
			map.fillRect((x * scaleX) | 0, (y * scaleY) | 0, 1, 1);
		}
		for (let entity of this.entities.children) {
			let color = false;
			if (!color) continue;
			if (entity.constructorName === "Tree") color = "#d9a066";
			else if (entity.constructorName === "Rocks") color = "#9badb7";
			let x = entity.x - this.left;
			let y = entity.y - this.top;
			map.save();
			map.translate((x * scaleX) | 0, (y * scaleY) | 0);
			map.fillStyle(color);
			map.fillRect(-1, -1, 2, 2);
			map.restore();
		}
		let gl = app.gl;
		let texture = app.gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, map.canvas);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		texture.width = map.width;
		texture.height = map.height;
		this.mapTexture = texture;
	},
	order(what) {
		let id = what.sid;
		if (this.orders.indexOf(id) > -1) return;
		this.clearOrderTimeout = COMMON.CLEAR_ORDER_INTERVAL;
		this.send("order", id);
		this.orders.push(id);
	}send(arg0: string, id: any) {
		throw new Error("Method not implemented.");
	}
,
	renderCost(equation, x, y) {
		let textHeight = app.fonts.default.getSize("x").height;
		let queue = [];
		let px = 0;
		let py = 0;
		for (let i = 0; i < equation.length; i += 2) {
			let text = equation[i];
			if (typeof text === "number") {
				text = String(text);
				let item = COMMON.items[equation[i + 1]];
				queue.push(2, "color", 0xffffff);
				queue.push(4, "fillText", text, px, py);
				px += app.fonts.default.getSize(text).width + 4;
				queue.push(2, "color", -1);
				queue.push(
					8,
					"drawImageRegion",
					app.textures.spritesheet,
					...item.sprite,
					px,
					(py + textHeight / 2 - item.sprite[3] / 2) | 0,
				);
				px += item.sprite[2];
			} else {
				queue.push(2, "color", 0xffffff);
				queue.push(4, "fillText", text, px, py);
				px += app.fonts.default.getSize(text).width;
				i--;
			}
			if (i < equation.length - 2) px += 4;
		}
		app.painter.reset();
		app.painter.align(0, 0);
		app.painter.font(app.fonts.default);
		app.painter.textAlign("left");
		app.painter.translate((x - px / 2) | 0, y);
		for (let i = 0; i < queue.length; i) {
			let count = queue[i];
			app.painter[queue[i + 1]].apply(app.painter, queue.slice(i + 2, i + 2 + count - 1));
			i += count + 1;
		}
	},
	createSoundButtons() {
		var button = this.gui.add("ActionButton");
		button.icon = [218, 2, 11, 12];
		button.tooltip = "sound";
		button.x = 48;
		button.y = 2;
		button.on("click", this.muteClick.bind(this, "sound"));
		this.soundButton = button;
		var button = this.gui.add("ActionButton");
		button.icon = [233, 3, 16, 10];
		button.tooltip = "sound";
		button.x = 48 + 24;
		button.y = 2;
		button.on("click", this.muteClick.bind(this, "music"));
		this.musicButton = button;
		if (localStorage.getItem("sound") !== null) app.sound.volume(localStorage.getItem("sound") | 0);
		if (localStorage.getItem("music") !== null) app.music.volume(localStorage.getItem("music") | 0);
		this.updateSoundButtons();
	},
	muteClick(channel, val) {
		val = !app[channel].volume();
		if (!val) {
			app[channel].volume(0.0);
		} else {
			app[channel].volume(1.0);
		}
		localStorage.setItem(channel, app[channel].volume());
		this.updateSoundButtons();
	},
	updateSoundButtons() {
		this.musicButton.disabled = !Boolean(app.music.volume());
		this.soundButton.disabled = !Boolean(app.sound.volume());
		this.musicButton.needRefresh = true;
		this.soundButton.needRefresh = true;
	},
	createButtons() {
		this.createSoundButtons();
		this.buttons = [];
		this.experienceBottle = this.gui.add("ExperienceBottle");
		var resources = this.gui.add("Resources");
		this.guiResources = resources;
		this.guiResources.on("click", function (e) {
			let resource = ["food", "wood", "gold", "water"][((e.x - app.game.guiResources.x) / 24) | 0];
			app.game.send("drop", { key: resource });
		});
		this.panels = { left: [], right: [], bottom: [] };
		for (let building of [
			"stone_wall",
			"stone_gate",
			"stone_tower",
			"wood_storage",
			"food_storage",
			"well",
			"stationary_catapult",
		]) {
			let def = COMMON.items[building];
			var button = this.gui.add("ActionButton");
			button.icon = def.icon;
			button.tooltip = def.tooltip;
			button.subtip = def.subtip;
			button.key = building;
			button.resource = def.resource;
			button.cost = def.cost;
			this.panels.bottom.push(button);
			this.buttons[building] = button;
			button.on(
				PLAYGROUND.MOBILE ? "dragstart" : "click",
				this.buildClick.bind(this, button, building),
			);
			this.buttons.push(button);
		}
		for (let plant of ["corn", "tree_plant"]) {
			let def = COMMON.items[plant];
			var button = this.gui.add("ActionButton");
			button.icon = def.icon;
			button.tooltip = def.tooltip;
			button.subtip = def.subtip;
			button.key = plant;
			button.resource = def.resource;
			button.cost = def.cost;
			this.panels.bottom.push(button);
			this.buttons[plant] = button;
			button.on(PLAYGROUND.MOBILE ? "dragstart" : "click", this.plantClick.bind(this, button, plant));
			this.buttons.push(button);
		}
		var button = this.gui.add("ActionButton");
		button.icon = [237, 72, 16, 16];
		button.tooltip = "Destroy building";
		button.subtip = "Costs as much gold as much structure points the building has";
		button.key = "destroyBuilding";
		button.on(PLAYGROUND.MOBILE ? "dragstart" : "click", this.destroyBuildingClick.bind(this, button));
		this.panels.bottom.push(button);
		var button = this.gui.add("ActionButton");
		button.sprite = "campfire";
		button.spriteScale = 0.5;
		button.spriteAlignY = 0.85;
		button.cost = 2;
		button.resource = "wood";
		button.key = "campfire";
		button.tooltip = "Start a campfire";
		button.subtip = "Heal 1 HP for 1 food";
		this.guiElements.campfire = button;
		this.panels.left.push(button);
		button.on(PLAYGROUND.MOBILE ? "dragstart" : "click", () => {
			this.action.set("place_campfire");
		});
		this.buttons.push(button);
		var button = this.gui.add("ActionButton");
		button.sprite = "tribesman/tribesman";
		button.cost = 2;
		button.spriteRow = 2;
		button.key = "recruit";
		this.buttons.recruit = button;
		button.resource = "food";
		button.tooltip = "Recruit new member;";
		button.subtip = "get an unequipped minion";
		button.action = "recruit";
		button.palette = 0;
		this.guiElements.recruit = button;
		this.panels.left.push(button);
		button.on("enter", function () {
			this.sprite = "tribesman/male/roll";
		});
		button.on("leave", function () {
			this.sprite = "tribesman/tribesman";
		});
		button.on(PLAYGROUND.MOBILE ? "dragstart" : "click", this.onActionButtonClick.bind(this, button));
		this.buttons.push(button);
		var button = this.gui.add("ActionButton");
		button.icon = COMMON.items.stay.icon;
		button.key = "stay";
		button.tooltip = COMMON.items.stay.tooltip;
		button.subtip = COMMON.items.stay.subtip;
		this.panels.left.push(button);
		button.on(PLAYGROUND.MOBILE ? "dragstart" : "click", () => {
			this.action.set("stay");
		});
		this.panels.bottom.push(button);
		let equipment = [
			"axe",
			"bow",
			"hammer",
			"sword",
			"scythe",
			"dagger",
			"wooden_shield",
			"reinforced_shield",
			"steel_shield",
			"hood",
			"viking_helmet",
			"legion_helmet",
		];
		for (let key of equipment) {
			let def = COMMON.items[key];
			let button = this.gui.add("ActionButton");
			button.palette = 0;
			let spriteKey = def.sprite || key;
			button.sprite = `tribesman/${spriteKey}/turntable`;
			button.def = def;
			button.cost = def.cost;
			button.resource = def.resource;
			button.action = "equip";
			button.key = key;
			button.tooltip = def.tooltip;
			button.subtip = def.subtip;
			if (def.palette) button.spritePalette = def.palette;
			button.on(PLAYGROUND.MOBILE ? "dragstart" : "click", this.onActionButtonClick.bind(this, button));
			this.buttons.push(button);
			this.buttons[key] = button;
			if (def.slot === "helmet" || def.slot === "shield") {
				this.panels.right.push(button);
			} else {
				this.panels.left.push(button);
			}
		}
		this.arrangeButtons();
	}arrangeButtons() {
		throw new Error("Method not implemented.");
	}
,
	layout: 1,
	buildClick(button, building) {
		if (this.disabledCheck(button)) return;
		let def = COMMON.items[building];
		this.action.set(def.buildMethod, building, "building/" + building);
	}disabledCheck(button: any) {
		throw new Error("Method not implemented.");
	}
,
	plantClick(button, plant) {
		if (this.disabledCheck(button)) return;
		this.action.set("PlantAPlant", plant);
	},
	destroyBuildingClick(button, plant) {
		this.action.set("destroyBuilding", plant);
	},
}
