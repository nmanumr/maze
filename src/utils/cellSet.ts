import {Cell} from "../board";
import {stringifyPosition} from "./point";

export class CellSet extends Map<string, Cell> {
  constructor(cells?: Cell[]) {
    super();

    if (cells) this.addAll(cells);
  }

  add(cell: Cell) {
    return this.set(stringifyPosition(cell.position), cell);
  }

  addAll(cells: Cell[]) {
    for (let cell of cells)
      this.add(cell);
  }

  hasCell(cell: Cell) {
    return this.has(stringifyPosition(cell.position));
  }

  remove(cell: Cell) {
    return this.delete(stringifyPosition(cell.position));
  }

  removeAll(cells: Cell[]) {
    for (let cell of cells)
      this.remove(cell);
  }

  getRandom(): Cell {
    const cells = Array.from(this.values());
    return cells[Math.round(Math.random() * (cells.length -1))];
  }
}
