<script>
	let content = $state("A");
	let mainMenuOpen = $state(true);
</script>

<div class="lobby-container">
	<div class="lobby-container">
		<img src="/logo.png" alt="logo" />
		<div class="lobby-container__menu-bg">
			<img src="/menu.gif" />
			<div onclick={() => (mainMenuOpen = true)} class="lobby-container__play-button">
				<img src="/buttons/start.png" />
			</div>
		</div>

		<div id="menuWindow" class="main-menu border-window" style:display={mainMenuOpen ? "flex" : "none"}>
			<div id="menuWindowTabs" class="main-menu__ui-tabs">
				<div class="selected">Play</div>
				<div class="new">News</div>
				<div class="">Changes</div>
				<div class="">Info</div>
			</div>

			<div class="main-menu__field">
				<input maxlength="12" class="tribeName" type="text" placeholder="Tribe name" />
			</div>

			<div class="main-menu__button-group">
				<div class="button"><span>Tutorial</span></div>
				<div class="button--green start" style="flex-grow: 2" id="startButton"><span>Start</span></div
				>
				<div class="button--blue"><span>More</span></div>
			</div>

			<div class="main-menu__gamemode">
				<div id="gameModeTabs" class="main-menu__ui-tabs"> 
					<div class="selected" style="flex-grow:1; flex-basis:0;">
						<img src="/modes/castle-icon.png">
						<span>Castle mode</span>
					</div>
				</div>
				<div class="main-menu__ui-tabs-panel">
					<p id="gameModeDescription"> </p>
				</div>
			</div>

			<div>
				<div class="main-menu__heading">Play with friends</div>
				<input maxlength="32" class="groupName" type="text" placeholder="Group name" />

				<p class="subtext"
					>Put the same text as your friend to play together.<br />Note that it will assign you a
					unique team that nobody else can join.</p
				>
			</div>
		</div>
	</div>
</div>
