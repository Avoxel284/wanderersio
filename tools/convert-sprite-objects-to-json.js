/**
 * avoxel284 2026
 *
 * In script.js, there is a large section of JSON starting at line 615.
 * It's believed to be exported sprite animation data from SpriteStack,
 * Rezoner's 3D to 2D pixel art animation software project.
 * While it's unknown why it is included in script.js, most likely it was
 * just a part of Rezoner's workflow.
 *
 * This script converts the objects contained in json-data.js and converts
 * it to actual .json files in src/.
 */

import fs from "fs";
import path from "path";
import { data } from "./sprite-json-data.js";

let keys = Object.keys(data);
let values = Object.values(data);

const __dirname = import.meta.dirname;
const srcPath = path.resolve(__dirname, "..", "src");

for (let i = 0; i <= keys.length - 1; i++) {
	let k = keys[i];
	let v = values[i];
	k.replace("images/", "");
	if (fs.existsSync(`${srcPath}/${k}`)) {
		console.log(`Skipping ${k} since it already exists`);
		continue;
	}

	try {
		fs.mkdirSync(path.dirname(`${srcPath}/${k}`), { recursive: true });
	} catch (err) {
		console.error(`Failed to write ${srcPath}/${k}`, err);
		continue;
	}

	fs.writeFileSync(`${srcPath}/${k}`, v);
	console.log(`Written ${i}/${keys.length}`);
}
