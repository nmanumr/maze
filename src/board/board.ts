import {Cell, OpposingRectangularDirection, RectangularDirection} from './cell';
import {Point} from "./point";

export interface ISize {
  readonly height: number;
  readonly width: number;
}

export class Board {
  public readonly cells: Array<Cell>;
  public readonly size: ISize;

  constructor(width: number, height: number) {
    this.size = {height, width};
    this.cells = [];
    this.initCells();
  }

  private initCells() {
    for (let y = 0; y < this.size.height; y++) {
      for (let x = 0; x < this.size.width; x++) {
        this.cells.push(new Cell(new Point(x, y)));
      }
    }
  }

  getRandomCell(): Cell {
    return this.cells[Math.round(Math.random() * (this.cells.length - 1))];
  }

  private getCell(position: Point): Cell {
    return this.cells[position.toIndex(this.size.width)];
  }

  getNeighbourCells(position: Point, visitableOnly: boolean = false): Map<RectangularDirection, Cell> {
    const neighbours = new Map<RectangularDirection, Cell>();
    const index = position.toIndex(this.size.width);

    if (index >= this.size.width) {
      const cell = this.cells[index - this.size.width];
      neighbours.set(RectangularDirection.TOP, cell);
    }

    if ((index + 1) % this.size.width != 0) {
      const cell = this.cells[index + 1];
      neighbours.set(RectangularDirection.RIGHT, cell);
    }

    if (index < this.cells.length - this.size.width) {
      const cell = this.cells[index + this.size.width];
      neighbours.set(RectangularDirection.BOTTOM, cell);
    }

    if (index % this.size.width != 0) {
      const cell = this.cells[index - 1];
      neighbours.set(RectangularDirection.LEFT, cell);
    }

    return neighbours;
  }

  getNeighbourCell(position: Point, direction: RectangularDirection): Cell {
    const cells = this.getNeighbourCells(position);
    return cells.get(direction);
  }

  getRelativeDirection(cell1: Point, cell2: Point): RectangularDirection {
    if (cell1.y === cell2.y + 1) {
      return RectangularDirection.TOP;
    }
    if (cell1.x === cell2.x - 1) {
      return RectangularDirection.RIGHT;
    }
    if (cell1.x === cell2.x + 1) {
      return RectangularDirection.LEFT;
    }
    if (cell1.y === cell2.y - 1) {
      return RectangularDirection.BOTTOM;
    }
    throw `'${cell1}' and '${cell2}' are not neighbours`;
  }

  removeInterWall(cell1: Point, cell2: Point): void {
    const relativeWallDirection = this.getRelativeDirection(cell1, cell2);
    const opposingWallDirection = OpposingRectangularDirection[relativeWallDirection];
    this.getCell(cell1).removeWall(relativeWallDirection);
    this.getCell(cell2).removeWall(opposingWallDirection);
  }

  addInterWall(cell1: Point, cell2: Point): void {
    const relativeWallDirection = this.getRelativeDirection(cell1, cell2);
    const opposingWallDirection = OpposingRectangularDirection[relativeWallDirection];
    this.getCell(cell1).setWall(relativeWallDirection);
    this.getCell(cell2).setWall(opposingWallDirection);
  }

  isConnected(cell1: Point, cell2: Point): Boolean {
    const relativeWallDirection = this.getRelativeDirection(cell1, cell2);
    const opposingWallDirection = OpposingRectangularDirection[relativeWallDirection];
    return this.getCell(cell1).hasWall(relativeWallDirection) && this.getCell(cell2).hasWall(opposingWallDirection);
  }

  clone() {
    const board = new Board(this.size.width,this.size.height);
    for (let i = 0; i < board.cells.length; i++) {
      board.cells[i] = this.cells[i].clone();
    }
    return board;
  }
}
