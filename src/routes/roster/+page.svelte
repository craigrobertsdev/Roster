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
  const colWidth = 35;
  const rowHeight = 25;
  const daysInYear: Date[] = [];
  for (let i = 0; i < 365; i++) {
    daysInYear.push(addDays(new Date(), i));
  }
  let headerGridWidth: number;
  let headerGridHeight: number;
  let startCol = 0;
  let startRow = 0;
  let employees = generateDummyData(50);
  let colsPerScreen: number;
  let rowsPerScreen: number;
  let data: Cell[][] = [];
  let visibleCells: Cell[][] = [];

  onMount(() => {
    viewportWidth = document.body.clientWidth;
    viewportHeight = document.body.clientHeight;
    colsPerScreen = Math.min(daysInYear.length, Math.ceil((viewportWidth - headerGridWidth) / colWidth));
    rowsPerScreen = Math.min(employees.length, Math.ceil((viewportHeight - rowHeight) / rowHeight));
    data = createCellsForFirstRender(employees, startCol, startRow, colsPerScreen, rowsPerScreen);
    visibleCells = getVisibleCells();
  });

  function handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    const newTop = Math.floor(target.scrollTop / rowHeight);
    const newLeft = Math.floor(target.scrollLeft / colWidth);

    if (startRow === newTop && startCol !== newLeft) {
      startCol = newLeft;
      visibleCells = getVisibleCells();
      return;
    }

    if (startCol === newLeft && startRow !== newTop) {
      const dist = newTop - startRow;
      startRow = newTop;
      visibleCells = getVisibleCells();
    }
  }

  function createCellsForFirstRender(employees: Employee[]) {
    const cells: Cell[][] = [];

    for (let i = 0; i < employees.length; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < employees[i].shifts.length; j++) {
        row.push({
          top: i * rowHeight,
          left: j * colWidth,
          content: employees[i].shifts[j].code,
        });
      }
      cells.push(row);
    }
    return cells;
  }

  function getVisibleCells() {
    return data.slice(startRow, startRow + rowsPerScreen).map((col) => col.slice(startCol, startCol + colsPerScreen));
  }
</script>

<h1>Welcome to the roster</h1>

<div class="container" on:scroll|stopPropagation|capture="{handleScroll}">
  <!-- Employee details grid -->
  <div bind:clientWidth="{headerGridWidth}" bind:clientHeight="{headerGridHeight}" class="header-grid">
    <div class="cell header-cell top-row">ID</div>
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
      {#each visibleCells as row}
        {#each row as cell}
          <div class="grid-cell" style:top="{cell.top}px" style:left="{cell.left}px">
            {cell.content}
          </div>
        {/each}
      {/each}
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
