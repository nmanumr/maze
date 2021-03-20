export interface Position {
  readonly x: number;
  readonly y: number;
}

/**
 * Convert a position (2d) to linear index
 */
export function positionToIndex(position: Position, width: number): number {
  return position.y * width + position.x;
}

export function stringifyPosition(position: Position) {
  return `${position.x}-${position.y}`;
}
