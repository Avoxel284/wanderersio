import type Application from "./Application";
import Events from "./Events";

export interface PlaygroundMouseEvent {
	x: number;
	y: number;
	deltaX?: number;
	deltaY?: number;
	button?: string;
	original: MouseEvent;
	id: number;
	touch?: boolean;
	wheelDelta?: number;
}

class Mouse extends Events {
	app: Application;

	elementOffset = { x: 0, y: 0 };
	x = 0;
	y = 0;

	lastMouseMoveData?: PlaygroundMouseEvent;

	lastMouseDownData?: PlaygroundMouseEvent;

	lastMouseUpData?: PlaygroundMouseEvent;

	lastMouseWheelData?: PlaygroundMouseEvent;

	buttons: { [button: string]: boolean } = {};

	enabled = true;
	locked = false;
	element: HTMLElement;
	disableContextMenu = true;

	constructor(app: Application) {
		super();

		this.app = app;
		this.element = app.container;

		// if (app.mouseThrottling) {
		// 	this.mousemove = PLAYGROUND.Utils.throttle(this.mousemove, app.mouseThrottling);
		// }

		this.element.addEventListener("mousemove", this.handleMouseMove);
		this.element.addEventListener("mousedown", this.handleMouseDown);
		this.element.addEventListener("mouseup", this.handleMouseUp);
		this.element.addEventListener("mouseout", this.handleMouseOut);
		this.element.addEventListener("contextmenu", this.handleContextMenu);

		this.element.requestPointerLock =
			this.element.requestPointerLock ||
			(this.element as any).mozRequestPointerLock ||
			(this.element as any).webkitRequestPointerLock;

		document.exitPointerLock =
			document.exitPointerLock ||
			(document as any).mozExitPointerLock ||
			(document as any).webkitExitPointerLock;
	}

	lock() {
		this.locked = true;
		this.element.requestPointerLock();
	}

	unlock() {
		this.locked = false;
		document.exitPointerLock();
	}

	private handleContextMenu(event: PointerEvent) {
		if (this.disableContextMenu && !event.metaKey) event.preventDefault();
	}

	private handleMouseOut(event: MouseEvent) {
		for (var i = 0; i < 3; i++) {
			this.handleMouseUp({
				...event,
				button: i,
			});
		}
	}

	private handleMouseMove(event: MouseEvent) {
		if (!this.enabled) return;
		this.lastMouseMoveData = {
			x: ((event.pageX - this.elementOffset.x - this.app.offsetX) / this.app.scale) | 0,
			y: ((event.pageY - this.elementOffset.y - this.app.offsetY) / this.app.scale) | 0,
			original: event,
			deltaX: event.movementX || (event as any).mozMovementX || (event as any).webkitMovementX || 0,
			deltaY: event.movementY || (event as any).mozMovementY || (event as any).webkitMovementY || 0,
			id: 255,
		};

		// if (this.app.mouseToTouch) {
		// 	// //      if (this.left) {
		// 	// this.mousemoveEvent.id = this.mousemoveEvent.identifier = 255;
		// 	// this.trigger("touchmove", this.mousemoveEvent);
		// 	// //      }
		// } else {
		this.trigger("mousemove", this.lastMouseMoveData);
		// }
	}

	private handleMouseDown(event: MouseEvent) {
		if (!this.enabled) return;

		let buttonName = ["left", "middle", "right"][event.button];
		this.lastMouseDownData = {
			x: this.lastMouseMoveData?.x || 0,
			y: this.lastMouseMoveData?.y || 0,
			button: buttonName,
			original: event,
			id: 255,
		};

		// if (this.app.mouseToTouch) {
		// this.trigger("touchmove", this.mousedownEvent);
		// this.trigger("touchstart", this.mousedownEvent);
		// } else {
		this.emit("mousedown", this.lastMouseDownData);
		// }

		// this.emit("keydown", {
		// 	key: "mouse" + buttonName,
		// });
	}

	private handleMouseUp(event: MouseEvent) {
		if (!this.enabled) return;

		let buttonName = ["left", "middle", "right"][event.button];

		if (!this.buttons[buttonName]) return;
		this.lastMouseUpData = {
			x: this.lastMouseMoveData?.x || 0,
			y: this.lastMouseMoveData?.y || 0,
			button: buttonName,
			original: event,
			id: 255,
		};

		// if (this.app.mouseToTouch) {
		// 	this.emit("touchend", this.mouseupEvent);
		// } else {
		this.emit("mouseup", this.lastMouseUpData);
		// }

		// this.emit("keyup", {
		// 	key: "mouse" + buttonName,
		// });

		this.buttons[buttonName] = false;
	}

	private handleMouseWheel(event: WheelEvent) {
		let buttonName = ["left", "middle", "right"][event.button];
		this.lastMouseWheelData = {
			x: this.lastMouseMoveData?.x || 0,
			y: this.lastMouseMoveData?.y || 0,
			button: buttonName,
			original: event,
			id: 255,
		};

		this.buttons[event.button] = false;

		this.emit("mousewheel", this.lastMouseWheelData);
		// this.emit("keydown", {
		// 	key: event.deltaY > 0 ? "mousewheelup" : "mousewheeldown",
		// });
	}

	initialize() {
		const eventNames =
			"onwheel" in document || (document as any)?.documentMode >= 9 ?
				["wheel"]
			:	["mousewheel", "DomMouseScroll", "MozMousePixelScroll"];

		let orgEvent = event || window.event,
			args = [].slice.call(arguments, 1),
			delta = 0,
			deltaX = 0,
			deltaY = 0,
			absDelta = 0,
			absDeltaXY = 0,
			fn;
	}

	// enableMousewheel() {
	// 	let callback = this.handleMouseWheel.bind(this);
	// 	let self = this;

	// 	var throttled = PLAYGROUND.Utils.throttle(function (event: WheelEvent) {
	// 		var orgEvent = event || window.event,
	// 			args = [].slice.call(arguments, 1),
	// 			delta = 0,
	// 			deltaX = 0,
	// 			deltaY = 0,
	// 			absDelta = 0,
	// 			absDeltaXY = 0,
	// 			fn;

	// 		// orgEvent.type = "mousewheel";

	// 		// Old school scrollwheel delta
	// 		if (orgEvent.deltaY) {
	// 			delta = orgEvent.deltaY;
	// 		}

	// 		if (orgEvent.detail) {
	// 			delta = orgEvent.detail * -1;
	// 		}

	// 		// New school wheel delta (wheel event)
	// 		if (orgEvent.deltaY) {
	// 			deltaY = orgEvent.deltaY * -1;
	// 			delta = deltaY;
	// 		}

	// 		// Webkit
	// 		if ((orgEvent as any).wheelDeltaY !== undefined) {
	// 			deltaY = (orgEvent as any).wheelDeltaY;
	// 		}

	// 		var result = delta ? delta : deltaY;

	// 		self.lastMouseWheelData.x = self.lastMouseMoveData.x;
	// 		self.lastMouseWheelData.y = self.lastMouseMoveData.y;
	// 		self.lastMouseWheelData.delta = result / Math.abs(result);
	// 		self.lastMouseWheelData.original = orgEvent;

	// 		callback({ ...event, ...self.lastMouseMoveData });

	// 		orgEvent.preventDefault();
	// 	}, 40);

	// 	for (var i = eventNames.length; i; ) {
	// 		self.element.addEventListener(
	// 			eventNames[--i],
	// 			function (event) {
	// 				throttled(event);

	// 				var prevent = !PLAYGROUND.Utils.classInParents(event.target, "scroll");

	// 				if (prevent) {
	// 					event.preventDefault();
	// 					event.stopPropagation();
	// 				}
	// 			},
	// 			false,
	// 		);
	// 		/*
	//         self.element.addEventListener(eventNames[--i], function(event) {

	//           e.preventDefault();
	//           e.stopPropagation();

	//         });
	//         */
	// 	}
	// }
}

export default Mouse;
