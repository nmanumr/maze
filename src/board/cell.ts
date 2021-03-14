import {Point} from "../utils";

export const enum RectangularDirection {
  LEFT = 'l',
  RIGHT = 'r',
  TOP = 't',
  BOTTOM = 'b',
}

export const OpposingRectangularDirection = {
  [RectangularDirection.LEFT]: RectangularDirection.RIGHT,
  [RectangularDirection.RIGHT]: RectangularDirection.LEFT,
  [RectangularDirection.TOP]: RectangularDirection.BOTTOM,
  [RectangularDirection.BOTTOM]: RectangularDirection.TOP,
};

export class Cell {
  public readonly walls: Map<RectangularDirection, boolean>;

  constructor(public readonly position: Point) {
    this.walls = new Map<RectangularDirection, boolean>();
    this.setAllWalls();
  }

  setAllWalls() {
    this.setWall(RectangularDirection.TOP);
    this.setWall(RectangularDirection.RIGHT);
    this.setWall(RectangularDirection.BOTTOM);
    this.setWall(RectangularDirection.LEFT);
  }

  removeAllWalls() {
    this.removeWall(RectangularDirection.TOP);
    this.removeWall(RectangularDirection.RIGHT);
    this.removeWall(RectangularDirection.BOTTOM);
    this.removeWall(RectangularDirection.LEFT);
  }

  setWall(dir: RectangularDirection) {
    this.walls.set(dir, true);
  }

  removeWall(dir: RectangularDirection) {
    this.walls.set(dir, false);
  }

  hasWall(dir: RectangularDirection): Boolean {
    return this.walls.get(dir);
  }

  clone() {
    const cell = new Cell(this.position);
    for (const [dir, hasWall] of this.walls.entries()) {
      cell.walls.set(dir, hasWall);
    }
    return cell;
  }
}
