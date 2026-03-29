import "../static/style/base.scss";

import client from "./client";
import items from "./lib/items";
import COMMON from "./lib/common";
import { Gamemodes, GamemodeKeys } from "./lib/gamemodes";

const menuTabs = ["PLAY", "NEWS", "CHANGES", "INFO"];

let currentMenuWindowTab = menuTabs[0];
let selectedGameMode = GamemodeKeys[0];

document.addEventListener("DOMContentLoaded", async () => {
	const playButton = document.getElementById("playButton");
	const menuWindow: HTMLElement | null = document.getElementById("menuWindow");
	const menuWindowTabs: HTMLElement | null = document.getElementById("menuWindowTabs");
	const gameModeDescription: HTMLElement | null = document.getElementById("gameModeDescription");
	const gameModeTabs: HTMLElement | null = document.getElementById("gameModeTabs");

	const backgroundMusic = document.createElement("audio");
	backgroundMusic.src = "/sounds/menu.ogg";
	// backgroundMusic.play();
	backgroundMusic.addEventListener("ended", function (ev) {
		this.currentTime = 0;
		this.play();
	});

	const menuWindowTabElements = menuWindowTabs?.querySelectorAll("a");
	if (menuWindowTabElements == null) throw "Tabs null";
	for (let i = 0; i <= menuWindowTabElements.length - 1; i++)
		menuWindowTabElements[i].addEventListener("click", () => changeWindowTab(menuTabs[i]));

	function changeWindowTab(tab: string) {
		if (menuWindowTabElements == null) return;
		currentMenuWindowTab = tab;
		for (let i = 0; i <= menuWindowTabElements.length - 1; i++) {
			if (["PLAY", "NEWS", "CHANGES", "INFO"][i] == tab) {
				menuWindowTabElements[i].classList.add("selected");
			} else {
				menuWindowTabElements[i].classList.remove("selected");
			}
		}
	}

	if (gameModeTabs == null) throw "Game mode tabs null";
	if (gameModeDescription == null) throw "Game mode description element null";
	gameModeDescription.innerText != Gamemodes[0].description;
	for (let i = 0; i <= Gamemodes.length - 1; i++) {
		if (Gamemodes[i].disabled) continue;
		let e = document.createElement("a");
		if (i == 0) e.className = "selected";
		e.style = "flex-grow: 1; flex-basis: 0;";
		e.innerHTML = `<img src="${Gamemodes[i].image}" />
		<span>${Gamemodes[i].label} mode</span>`;
		gameModeTabs.appendChild(e);

		e.addEventListener("click", (ev) => {
			selectedGameMode = GamemodeKeys[i];

			let gameModeTabElements = gameModeTabs?.querySelectorAll("a");
			if (gameModeTabElements == null) return;
			for (let x = 0; x <= gameModeTabElements.length - 1; x++) {
				if (GamemodeKeys[x] == GamemodeKeys[i]) {
					gameModeTabElements[x].classList.add("selected");
				} else {
					gameModeTabElements[x].classList.remove("selected");
				}
			}

			let description = Gamemodes[i].description;
			if (description != null) gameModeDescription.innerText = description;
			else gameModeDescription.innerText = "No description.";
		});
	}

	playButton?.addEventListener("click", (ev) => {
		if (menuWindow != null) menuWindow.style.display = "flex";
	});

	const changes = await client.get("/api/v1/changes");
	console.log(changes.data);
});
