/**
 * avoxel284 2026
 *
 * In script.js, after the sprite JSON data is defined, there is a "REWRITE_URL"
 * variable at line 2424. Most likely this constant contains every asset
 *
 */

import fs from "fs";
import path from "path";
import { data } from "./rewrite-urls-data.js";

const header = `### Collected assets report\nGenerated from [tools/convert-rewrite-urls-to-assets.js](tools/convert-rewrite-urls-to-assets.js).\nThis list ideally represents all files that are missing or collected, based on an object in script.js containing URL rewrites.`;

// this is just a short list of known music files that weren't listed in
// REWRITE_URLS. unfortunately does not include sound effects.
const musicAssets = [
	"sounds/music/one.ogg",
	"sounds/music/empty.ogg",
	"sounds/music/menu.ogg",
	"sounds/music/gameover.ogg",
	"sounds/music/victory.ogg",
];

const __dirname = import.meta.dirname;
const staticPath = path.resolve(__dirname, "..", "static");
const srcPath = path.resolve(__dirname, "..", "src");

let assets = [...musicAssets, ...Object.keys(data)];
let t = [];

let collected = 0;

let images = 0;
let imagesCollected = 0;

let jsonFiles = 0;
let jsonFilesCollected = 0;

let musicFiles = 0;
let musicFilesCollected = 0;

for (let i = 0; i <= assets.length - 1; i++) {
	let k = assets[i];
	let icon = "⚙️";

	if (k.endsWith(".json")) {
		jsonFiles++;
	} else if (k.endsWith(".png")) {
		icon = "🖼️";
		images++;
	} else if (k.endsWith(".jpg")) {
		icon = "🖼️";
		images++;
	} else if (k.endsWith(".gif")) {
		icon = "📽️";
		images++;
	} else if (k.endsWith(".glsl")) {
		icon = "🖌️";
	} else if (k.endsWith(".fragment")) {
		icon = "🖌️";
	} else if (k.endsWith(".ogg")) {
		icon = "🎵";
		musicFiles++;
	}

	if (fs.existsSync(`${staticPath}/${k}`) || fs.existsSync(`${srcPath}/${k}`)) {
		t.push(`- ${icon} \`${k}\` ✅`);
		collected++;
		if (/\.(png|jpg|gif)$/i.test(k)) imagesCollected++;
		if (/\.(json)$/i.test(k)) jsonFilesCollected++;
		if (/\.(ogg)$/i.test(k)) musicFilesCollected++;
	} else {
		t.push(`- ${icon} \`${k}\` ❌`);
	}
}

fs.writeFileSync(
	path.resolve(__dirname, "..", "assets.md"),
	`${header}<br/>**${collected}/${t.length}** assets have been collected in total **(${((collected / t.length) * 100).toString().substring(0, 4)}%)**.\nThis includes **${imagesCollected}/${images} images**, **${musicFilesCollected}/${musicFiles} music files**, and **${jsonFilesCollected}/${jsonFiles} JSON files**. \n\n${t.join("\n")}`,
);
console.log("Successfully written assets.md report.");
