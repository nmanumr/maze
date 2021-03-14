export interface IPosition {
  readonly x: number;
  readonly y: number;
}

export class Point {
  constructor(public readonly x: number, public readonly y: number) {
  }

  toIndex(width: number) {
    return this.y * width + this.x;
  }

  stringify() {
    return `${this.x}-${this.y}`;
  }
}
