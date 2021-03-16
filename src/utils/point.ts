export interface IPosition {
  readonly x: number;
  readonly y: number;
}

/**
 * Base implementation of 2d Point
 * Point and IPosition are interchangeably whenever possible
 */
export class Point {
  constructor(public readonly x: number, public readonly y: number) {
  }

  static from(position: Point | IPosition) {
    if (position instanceof Point)
      return position;

    return new Point(position.x, position.y);
  }

  toIndex(width: number) {
    return this.y * width + this.x;
  }

  stringify() {
    return `${this.x}-${this.y}`;
  }
}
