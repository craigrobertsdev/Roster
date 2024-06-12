<script lang="ts">
  import { onMount } from "svelte";
  import type { Employee, Shift, ShiftCode } from "../../types/types";
  import { generateDummyData, addDays } from "../../models/dummy";
  import GridCell from "./GridCell.svelte";

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
  let renderedCells: Cell[][] = [];
  let objPool: Cell[] = [];

  onMount(() => {
    viewportWidth = document.body.clientWidth;
    viewportHeight = document.body.clientHeight;
    colsPerScreen = Math.min(daysInYear.length, Math.ceil((viewportWidth - headerGridWidth) / colWidth));
    rowsPerScreen = Math.min(employees.length, Math.ceil((viewportHeight - rowHeight) / rowHeight));
    renderedCells = createCellsForFirstRender(employees, startCol, startRow, colsPerScreen, rowsPerScreen);
  });

  function handleScroll(event: Event) {
    console.log("Scroll event");
    const target = event.target as HTMLElement;
    const newTop = Math.floor(target.scrollTop / rowHeight);
    const newLeft = Math.floor(target.scrollLeft / colWidth);

    if (startRow === newTop && startCol !== newLeft) {
      const dist = Math.abs(newLeft - startCol);
      const direction = newLeft < startCol ? "left" : "right";
      startCol = newLeft;
      renderHorizontal(dist, target.scrollLeft, direction);
      renderedCells = renderedCells;
      return;
    }

    if (startCol === newLeft && startRow !== newTop) {
      const dist = newTop - startRow;
      startRow = newTop;
      renderVertical(dist, target.scrollLeft, target.scrollTop, newTop < startRow ? "up" : "down");
    }
  }

  function createCellsForFirstRender(employees: Employee[], startCol: number, startRow: number, endCol: number, endRow: number) {
    const cells: Cell[][] = [];

    for (let i = startRow; i < endRow; i++) {
      const row: Cell[] = [];
      for (let j = startCol; j < endCol; j++) {
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

  function renderHorizontal(dist: number, scrollX: number, direction: "left" | "right") {
    console.log("horizontal rendering");
    if (direction === "right") {
      // first: go over the currently rendered cells and move them left by the distance
      // second: shift the cells at the end to an object pool
      for (const row of renderedCells) {
        for (let k = 0; k < dist; k++) {
          objPool.push(row[k]);
        }

        for (let j = dist; j < row.length; j++) {
          row[j - dist] = row[j];
        }
      }
      // third: from the object pool - create new cells to cover the gap between the distance scrolled and the colsPerScreen
      for (let i = startRow; i < rowsPerScreen; i++) {
        for (let j = renderedCells[i].length - dist; j < renderedCells[i].length; j++) {
          const cell = objPool.length > 0 ? (objPool.pop() as Cell) : ({} as Cell);
          cell.left = renderedCells[i][j - 1].left + colWidth;
          cell.top = renderedCells[i][0].top;
          cell.content = employees[i].shifts[startRow + j].code;

          renderedCells[i][renderedCells[i].length - 1] = cell;
        }
      }
    } else {
    }
  }

  function renderVertical(dist: number, scrollX: number, scrollY: number, direction: "up" | "down") {}
</script>

<h1>Welcome to the roster</h1>

<div class="container" on:scroll|stopPropagation|capture|passive="{handleScroll}">
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
      {#each renderedCells as row}
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
