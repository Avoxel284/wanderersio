/**
 * avoxel284 2026
 ************************************
 * Refactored from https://github.com/rezoner/playground
 * Originally written by Rezoner.
 */

import type Application from "./Application";
import cq from "./CanvasQuery";

class CanvasLayer {
	app: Application;
	layer: any;

	constructor(app: Application) {
		this.app = app;
		this.layer = cq().appendTo(this.app.container);

		if (!this.app.customContainer) {
			this.app.container.style.margin = "0px";
			this.app.container.style.overflow = "hidden";
		}
	}

	handleResize(data: any) {
		let layer = this.layer;

		if (!layer) return;

		layer.useAlpha = false;

		layer.width = this.app.width;
		layer.height = this.app.height;

		if (
			document.fullscreenElement ||
			(document as any).webkitFullscreenElement ||
			(document as any).mozFullScreenElement ||
			(document as any).msFullscreenElement
		) {
			layer.canvas.style.transformOrigin = "center";
			layer.canvas.style.webkitTransformOrigin = "center";
		} else {
			layer.canvas.style.transformOrigin = "0 0";
			layer.canvas.style.webkitTransformOrigin = "0 0";
		}
		layer.canvas.style.transform =
			"translate(" +
			this.app.offsetX +
			"px," +
			this.app.offsetY +
			"px) scale(" +
			this.app.scale +
			", " +
			this.app.scale +
			")";
		layer.canvas.style.transformStyle = "preserve-3d";

		layer.canvas.style.webkitTransform =
			"translate(" +
			this.app.offsetX +
			"px," +
			this.app.offsetY +
			"px) scale(" +
			this.app.scale +
			", " +
			this.app.scale +
			")";
		layer.canvas.style.webkitTransformStyle = "preserve-3d";

		cq().smoothing = this.app.smoothing;

		layer.update();

		if ("WebkitAppearance" in document.documentElement.style) {
			layer.canvas.style.imageRendering = this.app.smoothing ? "auto" : "pixelated";
		} else {
			layer.canvas.style.imageRendering = this.app.smoothing ? "auto" : "-moz-crisp-edges";
		}

		layer.canvas.addEventListener("mousedown", () => {
			this.app.container.focus();
			//  function () {
			// this.focus();
		});
	}
}

export default CanvasLayer;
