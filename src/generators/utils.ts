import {Board, Cell, RectangularDirection} from "../board";
import {stringifyPosition} from "../utils";
import {CellSet} from "../utils/cellSet";
import {MarkovDecision} from "../utils/markovDecision";

/** return first unvisited cell from board */
export function getUnvisitedCell(board: Board, visitedCells: CellSet) {
  for (let cell of board.cells) {
    if (!visitedCells.has(stringifyPosition(cell.position))) {
      return cell;
    }
  }
}

/** return a random element from array */
export function getRandomFrom<T>(list: T[]): T {
  return list[Math.round(Math.random() * (list.length - 1))];
}

/** return a random int between min (inclusive) and max (exclusive) */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

/** convert xy to state index */
function stateToXY(state: number, board: Board): [number, number] {
  return [state % board.size.height, Math.floor(state / board.size.height)];
}

/** convert state index to xy */
function xyToState([x, y]: [number, number], board: Board) {
  return y * board.size.width + x;
}

// wilson, hunt&kill, aldousBroder, backtrack
/**
 * Do a random walk in the board until some condition is fulfilled
 * Using markov decision process to optimize random walks
 */
export function randomWalkUntil(
  cell: Cell,
  board: Board,
  until: (cell: Cell, path: Cell[]) => boolean,
  visitedCells: CellSet = null,
  walkInVisited = false,
  path: Cell[] = [],
): Cell[] {
  const model = new MarkovDecision<RectangularDirection>({
    stateSize: board.size.height * board.size.width,
    maxActions: 4,
    allowedActions(state: number) {
     const actions = [];
     const [x, y] = stateToXY(state, board);
     if (x > 0) actions.push(RectangularDirection.LEFT);
     if (y > 0) actions.push(RectangularDirection.UP);
     if (x < board.size.width - 1) actions.push(RectangularDirection.RIGHT);
     if (y < board.size.height - 1) actions.push(RectangularDirection.DOWN);

     return actions;
    },
    nextState(state: number, action: number): number {
      let [x, y] = stateToXY(state, board);
      if (action === RectangularDirection.UP) y--;
      if (action === RectangularDirection.DOWN) y++;
      if (action === RectangularDirection.LEFT) x--;
      if (action === RectangularDirection.RIGHT) x++;
      return xyToState([x, y], board);
    },
    reward(state: number, action: number, nextState: number): number {
      const [x, y] = stateToXY(nextState, board);
      const cell = board.getCell({x, y});
      if (visitedCells && (walkInVisited ? !visitedCells.hasCell(cell) : visitedCells.hasCell(cell))) {
        return -1;
      }
      if (path.includes(cell)) {
        return -1;
      }
      return 1;
    },
  })

  while (until(cell, path)) {
    path.push(cell);

    const {x, y} = cell.position;
    model.learn();
    let direction = model.act(xyToState([x, y], board));
    cell = board.getNeighbourCell(cell.position, direction);
  }

  if (!path.includes(cell)) {
    path.push(cell);
  }
  return path;
}
