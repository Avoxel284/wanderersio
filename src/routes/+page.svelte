<script lang="ts">
	import { Gamemodes } from "$lib/gamemodes";
	import client from "$lib/client";
	import { onMount } from "svelte";

	let mainMenuOpen = $state(true);
	let selectedGameMode = $state(0);
	let currentMainMenuTab = $state(0);
	let audioPlayer: HTMLAudioElement;
	let noticesData: null | { changes: any; changesHash: string; news: any; newNews: boolean } = $state(null);
	let newChanges = $state(false);

	const tabs = ["Play", "News", "Changes", "Info"];

	onMount(() => {
		audioPlayer.src = "/sounds/music/menu.ogg";
		audioPlayer.play();

		audioPlayer.addEventListener("ended", function (ev) {
			this.currentTime = 0;
			this.play();
		});

		client.get("/api/v1/notices").then(({ data }) => {
			if (data == null) return;
			noticesData = data;
			let changesHash = localStorage.getItem("last_viewed_changes_hash");
			if (changesHash == null || changesHash != data.changesHash) newChanges = true;
		});
	});

	function changeTab(index: number) {
		currentMainMenuTab = index;
		if (index == 2) {
			if (noticesData == null) return;
			localStorage.setItem("last_viewed_changes_hash", noticesData?.changesHash);
			newChanges = false;
		}
	}
</script>

<audio bind:this={audioPlayer}></audio>

<div class="lobby-container">
	<div class="lobby-container">
		<img src="/logo.png" alt="logo of wanderers.io" />
		<div class="lobby-container__menu-bg">
			<img src="/menu.gif" alt="looped gif of gameplay" />
			<div onclick={() => (mainMenuOpen = true)} class="lobby-container__play-button">
				<img src="/buttons/start.png" />
			</div>
		</div>

		<div id="menuWindow" class="main-menu border-window" style:display={mainMenuOpen ? "flex" : "none"}>
			<div id="menuWindowTabs" class="main-menu__ui-tabs">
				{#each tabs as tab, index}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						onclick={() => changeTab(index)}
						class:selected={currentMainMenuTab == index}
						class:new={(index == 1 && noticesData?.newNews == true) || (index == 2 && newChanges)}
						>{tab}</div
					>
				{/each}
			</div>

			{#if currentMainMenuTab == 0}
				<div class="main-menu__field">
					<input maxlength="12" class="tribeName" type="text" placeholder="Tribe name" />
				</div>

				<div class="main-menu__button-group">
					<div class="button--disabled"><span>Tutorial</span></div>
					<div class="button--green start" style="flex-grow: 2"><span>Start</span></div>
					<div class="button--disabled"><span>More</span></div>
				</div>

				<div class="main-menu__gamemode">
					<div id="gameModeTabs" class="main-menu__ui-tabs">
						{#each Gamemodes as gamemode, index}
							{#if !gamemode.disabled}
								<div
									role="button"
									tabindex="0"
									onclick={() => (selectedGameMode = index)}
									onkeydown={() => (selectedGameMode = index)}
									class:selected={selectedGameMode == index}
									style="flex-grow:1; flex-basis:0;"
								>
									<img src={gamemode.image} alt="icon" />
									<span>{gamemode.label} mode</span>
								</div>
							{/if}
						{/each}
					</div>
					<div class="main-menu__ui-tabs-panel">
						<p id="gameModeDescription">{Gamemodes[selectedGameMode].description}</p>
					</div>
				</div>

				<div>
					<div class="main-menu__heading">Play with friends</div>
					<input maxlength="32" class="groupName" type="text" placeholder="Group name" />

					<p style="margin-top:10px" class="subtext"
						>Put the same text as your friend to play together.<br />Note that it will assign you
						a unique team that nobody else can join.</p
					>
				</div>
			{/if}

			{#if currentMainMenuTab == 2}
				{#each noticesData?.changes as changesItem}
					<div class="main-menu__change">
						<div class="main-menu__heading">{changesItem.title}</div>
						<p class="subtext">{changesItem.body}</p>
					</div>
				{/each}
			{/if}

			<span class="main-menu__version">v4506</span>
		</div>
	</div>
</div>
