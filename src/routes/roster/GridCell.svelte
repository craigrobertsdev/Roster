<script lang="ts">
	export let top: string;
	export let left: string;
</script>

<div class="grid-cell" style:top style:left>
	<slot></slot>
</div>

<style>
	.grid-cell {
		position: absolute;
		width: 30px;
		height: 18px;
		padding: 3px 2px;
		border-right: 1px solid black;
		border-bottom: 1px solid black;
		text-align: center;
		font-size: 0.9rem;
	}
</style>
