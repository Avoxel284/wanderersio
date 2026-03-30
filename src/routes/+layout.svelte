<script lang="ts">
	import "../style/base.scss";
	let { children } = $props();
	let cv: HTMLCanvasElement;
	let disconnected = $state(false);
	let gameOver = $state(false);
</script>

{@render children()}

<canvas bind:this={cv}></canvas>

{#if disconnected}
	<div class="modal border-window">
		<img src="disconnected_2x.png" alt="disconnected icon" />
		<h2>Disconnected</h2>
		<p>The connection to the server has been lost.<br />Please reload in a minute.</p>
	</div>
	<div class="backdrop"> </div>
{/if}

{#if gameOver}
	<div class="modal border-window">
		<img src="death_2x.png" alt="disconnected icon" />
		<h2>Game Over</h2>
		<p>You died.</p>
	</div>
	<div class="backdrop"> </div>
{/if}
