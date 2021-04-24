/**
 * This file contains functions for generic maze board.
 *
 * A board is a byte array with each byte representing a single cell as following
 *  - 8th bit (LSB) is disabled status of cell i.e., 0 if cell if enabled
 *  - 7-1 bits can be used for passage status i.e., 0 if there is a wall
 * so technically this type of board representation can have 7 walls for each cell
 *
 * The idea is that a board representation is independent of how that board will be rendered.
 * So can wrap this representation to any type of board like triangle, rectangular,
 * circular, hexagonal etc.
 */

export interface BaseBoard {
  board: Uint8Array;
}

/**
 * Returns a new generic maze board of given size;
 */
export function genericBoard(size: number): BaseBoard {
  return {
    board: new Uint8Array(size)
  };
}

/**
 * Checks if the given cell is enabled or not
 */
export function isEnabled(cell: number): boolean {
  return Boolean(cell & 1 << 7);
}

/**
 * Returns a new cell representation of the
 * given cell with all wall removed
 */
export function removeAllWall(cell: number): number {
  return !isEnabled(cell) ? cell : cell & 0b0000_0000;
}

/**
 * Returns a new cell representation of the
 * given cell with all wall removed
 */
export function setAllWalls(cell: number): number {
  return !isEnabled(cell) ? cell : cell | 0b0111_1111;
}

/**
 * Checks if the given cell has specific wall or not
 * @param cell byte representation of cell
 * @param wall index of specific wall
 */
export function hasCellWall(cell: number, wall: number): boolean {
  return !isEnabled(cell) || Boolean(cell & 1 << wall);
}

/**
 * Returns a new cell representation of the
 * given cell with the specified wall set
 */
export function setWall(cell: number, wall: number): number {
  return !isEnabled(cell) ? cell : cell | (1 << wall);
}

/**
 * Returns a new cell representation of the
 * given cell with the specified wall removed
 */
export function removeWall(cell: number, wall: number): number {
  return !isEnabled(cell) ? cell : cell | (1 << wall);
}
