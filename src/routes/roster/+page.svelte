<script lang="ts">
	import { onMount } from "svelte";
	import type { Employee, Shift, ShiftCode } from "../../types/types";
	import { generateDummyData, addDays } from "../../models/dummy";

	type Cell = {
		top: number;
		left: number;
		content: string;
	};

	let viewportWidth: number;
	let viewportHeight: number;
	const colWidth = 25;
	const daysInYear: Date[] = [];
	for (let i = 0; i < 365; i++) {
		daysInYear.push(addDays(new Date(), i));
	}
	let rowHeight: number; // determined by one of the header cells
	let headerGridWidth: number;
	let headerGridHeight: number;
	let endCol: number;
	let endRow: number;

	onMount(() => {
		viewportWidth = document.body.clientWidth;
		viewportHeight = document.body.clientHeight;
		endCol = Math.ceil((viewportWidth - headerGridWidth) / colWidth);
		endRow = Math.min(
			employees.length,
			Math.ceil((viewportHeight - rowHeight) / rowHeight),
		);
		console.log(viewportWidth, headerGridWidth);
		console.log(viewportHeight, headerGridHeight);
		console.log(endCol, endRow);
	});

	let startCol = 0;
	let startRow = 0;
	let employees = generateDummyData(50);
	// let cells: Cell[] = createCells(employees, startCol, startRow, endCol, endRow);

	// function createCells(employees: Employee[], startCol: number, startRow: number, endCol: number, endRow: number);) {
	// 	const cells: Cell[] = [];
	//
	//
	// 	return cells;
	// }
</script>

<h1>Welcome to the roster</h1>

<div class="container">
	<!-- Employee details grid -->
	<div
		bind:clientWidth={headerGridWidth}
		bind:clientHeight={headerGridHeight}
		class="header-grid"
	>
		<div bind:clientHeight={rowHeight} class="cell header-cell top-row">ID</div>
		<div class="cell header-cell top-row">Rank</div>
		<div class="cell header-cell name-cell top-row">First Name</div>
		<div class="cell header-cell name-cell top-row">Last Name</div>

		{#each employees as e}
			<div class="cell header-cell">{e.id}</div>
			<div class="cell header-cell">{e.rank}</div>
			<div class="cell header-cell name-cell">{e.firstName.slice(0, 25)}</div>
			<div class="cell header-cell name-cell">{e.lastName}</div>
		{/each}
	</div>

	<!-- Date row -->
	<div class="date-row top-row">
		{#each daysInYear as day, i}
			<div class="date-cell" style:left="{35 * i}px">
				{day.getDate()}/{day.getMonth() + 1}
			</div>
		{/each}
	</div>

	<div class="grid-container">
		<div class="roster-grid">
			<div class="test-1"></div>
			<div class="test-2"></div>
			<div class="test-3"></div>
		</div>
	</div>
</div>

<style>
	.container {
		overflow: scroll;
		position: relative;
		max-height: 800px;
		width: 100%;
		border: 1px solid black;
		display: grid;
		grid-template-columns: 350px 1fr;
		grid-template-rows: 25px 1fr;
	}

	.header-grid {
		z-index: 30;
		display: grid;
		grid-template-columns: 50px 50px 125px 125px;
		position: sticky;
		left: 0;
		grid-row: 1 / -1;
		grid-column: 1;
	}

	.date-row {
		grid-row: 1 / 2;
		grid-column: 2;
		position: relative;
	}

	.grid-container {
		position: relative;
		grid-row: 2;
		grid-column: 2;
		width: 100%;
		background-color: blue;
	}

	.name-cell {
		width: 120px;
		overflow: clip;
		height: 18px;
	}

	.top-row {
		position: sticky;
		top: 0;
		z-index: 20;
	}

	.header-cell {
		z-index: 10;
		background-color: lightblue;
	}

	.header-cell.top-row {
		z-index: 30;
		background-color: yellow;
	}

	.cell {
		border-right: 1px solid black;
		border-bottom: 1px solid black;
		padding: 3px 2px;
		text-align: center;
	}

	.date-cell {
		position: absolute;
		width: 30px;
		height: 18px;
		padding: 3px 2px;
		border-right: 1px solid black;
		border-bottom: 1px solid black;
		text-align: center;
		z-index: 20;
	}
</style>
