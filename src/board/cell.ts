import {Point} from "../utils";

export const enum RectangularDirection {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down',
}

export const OpposingRectangularDirection = {
  [RectangularDirection.LEFT]: RectangularDirection.RIGHT,
  [RectangularDirection.RIGHT]: RectangularDirection.LEFT,
  [RectangularDirection.UP]: RectangularDirection.DOWN,
  [RectangularDirection.DOWN]: RectangularDirection.UP,
};

export class Cell {
  public readonly walls: Map<RectangularDirection, boolean>;

  constructor(public readonly position: Point) {
    this.walls = new Map<RectangularDirection, boolean>();
    this.setAllWalls();
  }

  setAllWalls() {
    this.setWall(RectangularDirection.UP);
    this.setWall(RectangularDirection.RIGHT);
    this.setWall(RectangularDirection.DOWN);
    this.setWall(RectangularDirection.LEFT);
  }

  removeAllWalls() {
    this.removeWall(RectangularDirection.UP);
    this.removeWall(RectangularDirection.RIGHT);
    this.removeWall(RectangularDirection.DOWN);
    this.removeWall(RectangularDirection.LEFT);
  }

  setWall(dir: RectangularDirection) {
    this.walls.set(dir, true);
  }

  removeWall(dir: RectangularDirection) {
    this.walls.set(dir, false);
  }

  hasWall(dir: RectangularDirection): boolean {
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
