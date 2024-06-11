<script lang="ts">
	import { onMount } from "svelte";
	import type { Employee, Shift, ShiftCode } from "../../types/types";
	import { generateDummyData, addDays } from "../../models/dummy";

	type Cell = {
		top: number;
		left: number;
		content: string;
	};

	const viewportWidth = document.body.clientWidth;
	const viewportHeight = document.body.clientHeight;
	const colWidth = 25;
	const daysInYear: Date[] = [];
	for (let i = 0; i < 365; i++) {
		daysInYear.push(addDays(new Date(), i))
	}
	let rowHeight: number; // determined by one of the header cells
	let headerGridWidth: number;
	let headerGridHeight: number;

	onMount(() => {
		console.log(headerGridHeight, headerGridWidth, rowHeight);
	});

	let startCol = 0;
	let startRow = 0;
	// let endCol = Math.ceil((viewportWidth - headerGridWidth) / colWidth);
	// let endRow: Math.min
	let employees = generateDummyData(10);
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
		<div bind:clientHeight={rowHeight} class="cell header-cell">ID</div>
		<div class="cell header-cell">Rank</div>
		<div class="cell header-cell name-cell">First Name</div>
		<div class="cell header-cell name-cell">Last Name</div>

		{#each employees as e}
			<div class="cell header-cell">{e.id}</div>
			<div class="cell header-cell">{e.rank}</div>
			<div class="cell header-cell name-cell">{e.firstName.slice(0, 25)}</div>
			<div class="cell header-cell name-cell">{e.lastName}</div>
		{/each}
	</div>

	<!-- Date row -->
	<div class="date-row">
		{#each daysInYear as day, i}
			<div class="date-cell" style:left="{35 * i}px">{day.getDate()}/{day.getMonth() + 1}</div>
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
		max-height: 800px;
		width: 100%;
		border: 1px solid black;
		display: grid;
		grid-template-columns: 345px 1fr;
		grid-auto-rows: auto;
	}

	.header-grid {
		z-index: 10;
		background: white;
		display: grid;
		grid-template-columns: 50px 50px 120px 120px;
		position: sticky;
		left: 0;
		grid-row: 1 / -1;
		grid-column: 1;
	}

	.grid-container {
		position: relative;
		/* grid-row: 2 / -1; */ 
		grid-column: 2;
		background-color: blue;
	}

	.name-cell {
		width: 120px;
		overflow: clip;
		height: 18px;
	}

	.cell {
		border-right: 1px solid black;
		border-bottom: 1px solid black;
		padding: 3px 2px;
		text-align: center;
	}

	.date-row {
		grid-row: 1;
		grid-column: 2;
		position: relative;
	}

	.date-cell {
		position: absolute;
		width: 30px;
		height: 18px;
		padding: 3px 2px;
		border-right: 1px solid black;
		border-bottom: 1px solid black;
		text-align: center;
}

</style>
