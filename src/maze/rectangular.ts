import {BaseBoard, isEnabled, hasCellWall} from "./base";
import {Optional} from 'utility-types';

/*--------------
 * Types
 *-------------- */

export enum Direction {
  TOP = 0b0001,
  RIGHT = 0b0010,
  BOTTOM = 0b0100,
  LEFT = 0b1000,
}

export interface Size {
  height: number;
  width: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface RectangularBoard extends BaseBoard {
  size: Size;
}


/*-------------------------
 * Constructor Functions
 *------------------------- */

/**
 * Returns a new rectangularBoard for the given size
 */
export function rectangularBoard(size: Size): RectangularBoard {
  return {
    board: new Uint8Array(size.width * size.height),
    size,
  }
}

/**
 * Casts base board to RectangularBoard
 */
export function rectangularFromBaseBoard({board}: BaseBoard, size: Size): RectangularBoard {
  return {board, size}
}

/*-------------------------
 * Position Functions
 *------------------------- */

/**
 * Linear index from position
 */
export function toIndex(position: Position, {size}: Optional<RectangularBoard, 'board'>) {
  return position.y * size.width + position.x;
}

/**
 * Position from linear index
 */
export function toPosition(index: number, {size}: Optional<RectangularBoard, 'board'>) {
  return {
    x: index % size.height,
    y: Math.floor(index / size.height),
  };
}

/*-------------------------
 * Cell value Functions
 *------------------------- */

/**
 * get cell at given position
 */
export function getCell(position: Position, {board, size}: RectangularBoard): number {
  return board[toIndex(position, {size})];
}

/**
 * set cell at given position
 */
export function setCell(position: Position, value: number, {board, size}: RectangularBoard) {
  return board[toIndex(position, {size})] = value;
}

/*-------------------------
 * Direction Utils
 *------------------------- */

/**
 * return a opposing direction
 *
 * getOpposingDirection(Direction.LEFT) -> Direction.RIGHT
 */
export function getOpposingDirection(direction: Direction): Direction {
  return ((direction << 2) | (direction >> 2)) & 0b1111;
}

/**
 * Get relative direction between two positions
 */
export function getRelativeDirection(pos1: Position, pos2: Position): Direction {
  if (pos1.y < pos2.y) return Direction.TOP;
  if (pos1.x > pos2.x) return Direction.RIGHT;
  if (pos1.y > pos2.y) return Direction.BOTTOM;
  if (pos1.x < pos2.x) return Direction.LEFT;

  throw `'${pos1}' and '${pos2}' are not neighbours`;
}

/*-------------------------
 * Cell Neighbourhood Utils
 *------------------------- */

/**
 * Returns a new position in direction relative to the given position
 */
export function getRelativePosition({x, y}: Position, direction: Direction) {
  let newPosition = {x, y};
  if (direction === Direction.TOP) newPosition.y--;
  if (direction === Direction.RIGHT) newPosition.x++;
  if (direction === Direction.BOTTOM) newPosition.y++;
  if (direction === Direction.LEFT) newPosition.x--;
  return newPosition;
}

/**
 * Get neighbour cells of the given position
 */
export function getNeighbourCells(position: Position, {board, size}: RectangularBoard, visitableOnly = false) {
  let neighbours = new Map<Direction, number>(),
    index = toIndex(position, {size});

  if (index >= size.width) {
    const cell = board[index - size.width];
    if (isEnabled(cell))
      neighbours.set(Direction.TOP, cell);
  }

  if ((index + 1) % size.width != 0) {
    const cell = board[index + 1];
    if (isEnabled(cell))
      neighbours.set(Direction.RIGHT, cell);
  }

  if (index < board.length - size.width) {
    const cell = board[index + size.width];
    if (isEnabled(cell))
      neighbours.set(Direction.BOTTOM, cell);
  }

  if (index % size.width != 0) {
    const cell = board[index - 1];
    if (isEnabled(cell))
      neighbours.set(Direction.LEFT, cell);
  }

  if (visitableOnly) {
    const visitableNeighbours = Array.from(neighbours.entries())
      .filter(([dir]) => {
        return !hasInterWall(getRelativePosition(position, dir), position, {board, size});
      });

    neighbours = new Map(visitableNeighbours);
  }

  return neighbours;
}

/**
 * Returns a neighbour cell in relative direction of given position
 */
export function getNeighbourCell(position: Position, direction: Direction, {board, size}: RectangularBoard) {
  const newPosition = getRelativePosition(position, direction);
  return getCell(newPosition, {board, size});
}

/**
 * get allowed directions from a given position
 *
 * if visitableOnly is false then it only check nif neighbour is enabled or not
 */
export function getAllowedDirection({x, y}: Position, {board, size}: RectangularBoard, visitableOnly = true) {
  let directions = [];

  if (y > 0) directions.push(Direction.TOP);
  if (x < size.width - 1) directions.push(Direction.RIGHT);
  if (y < size.height - 1) directions.push(Direction.BOTTOM);
  if (x > 0) directions.push(Direction.LEFT);

  directions.filter((dir) => {
    const newPos = getRelativePosition({x, y}, dir);
    const cell = board[toIndex(newPos, {size})];
    if (visitableOnly && hasInterWall(newPos, {x, y}, {board, size})) {
      return false;
    }
    return isEnabled(cell);
  });

  return directions;
}

/*-------------------------
 * Cell Wall Utils
 *------------------------- */

function _setInterWall(
  pos1: Position, pos2: Position,
  {board, size}: RectangularBoard,
  fn: (cell: number, dir: Direction) => number
) {
  const cell1 = getCell(pos1, {board, size});
  const cell2 = getCell(pos1, {board, size});

  const cell1Dir = getRelativeDirection(pos1, pos2);
  const cell2Dir = getOpposingDirection(cell1Dir);

  isEnabled(cell1) && setCell(pos1, fn(cell1, cell1Dir), {board, size});
  isEnabled(cell2) && setCell(pos2, fn(cell2, cell2Dir), {board, size});
}

/**
 * Remove wall between the given two cell positions
 */
export function removeInterWall(pos1: Position, pos2: Position, {board, size}: RectangularBoard): void {
  _setInterWall(pos1, pos2, {board, size}, (cell, dir) => cell & ~dir);
}

/**
 * Set wall between the given two cell positions
 */
export function setInterWall(pos1: Position, pos2: Position, {board, size}: RectangularBoard): void {
  _setInterWall(pos1, pos2, {board, size}, (cell, dir) => cell | dir);
}

/**
 * Set wall between the given two cell positions
 */
export function hasInterWall(pos1: Position, pos2: Position, {board, size}: RectangularBoard): boolean {
  const cell1Dir = getRelativeDirection(pos1, pos2);
  const cell2Dir = getOpposingDirection(cell1Dir);

  return hasWall(pos1, cell1Dir, {board, size}) && hasWall(pos2, cell2Dir, {board, size});
}

/**
 * has cell at given position have wall in the given direction
 */
export function hasWall(position: Position, direction: Direction, {board, size}: RectangularBoard) {
  return hasCellWall(getCell(position, {board, size}), Math.log2(direction));
}
