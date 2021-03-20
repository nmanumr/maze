import {h} from "../utils";
import {IRenderer} from "./types";
import {Board, Cell, Size, RectangularDirection} from "../board";
import {Observable} from "rxjs";
import {PlayerState} from "../player";
import {skip} from "rxjs/operators";

export default class RectangularSvg implements IRenderer {
  /*
   * Some rendering options
   * should some easier way to set them
   */
  public cellSize = 30;
  public lineWidth = 2;
  public playerPadding = 7;

  constructor() {
    // setting a css variable for wall animation
    let root = document.documentElement;
    root.style.setProperty('--cell-size', this.cellSize + 'px');
  }

  /**
   * Renders game board to svg
   *
   * The idea is renderer will be initialized only once
   * and then render function will be called for each new board,
   * while renderer will take care of player changes without explicitly
   * rerendering of board.
   *
   * @param board individual board snapshot
   * @param player$ Observable of player position changes
   */
  render(board: Board, player$: Observable<PlayerState>): HTMLElement {
    const width = this.cellSize * (board.size.width + 2) + this.lineWidth;
    const height = this.cellSize * (board.size.height + 2) + this.lineWidth;
    const playerEl = this.renderPlayer();

    // listen to player changes and update player on board
    player$
      .pipe(skip(1))
      .subscribe(({position}) => {
        const [x, y] = [position.x, position.y]
          .map((e) => (this.cellSize * e) + this.playerPadding + this.cellSize);

        playerEl.setAttribute('x', x + '');
        playerEl.setAttribute('y', y + '');
      })

    // render path definition string for each cell
    // and join them to create single path string
    // for whole board
    let path = board.cells.map((value) => {
      return this.renderCell(value, board.size);
    }).join('');

    return (
      <svg stroke="currentColor" fill="none" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {playerEl}
        <path d={path} class="maze-wall" stroke-width={this.lineWidth} stroke-linecap="round"/>
      </svg>
    );
  }

  /**
   * Renders player as svg rect
   */
  renderPlayer() {
    const size = this.cellSize - (this.playerPadding * 2);
    return <rect width={size} height={size} fill="currentColor"
                 class="text-blue-500"
                 stroke-width="0" rx="3" id="player"
                 x={1 + this.playerPadding + this.cellSize} y={1 + this.playerPadding + this.cellSize}/>;
  }

  /**
   * Renders a single cell walls to svg path string
   * @param cell cell to render
   * @param size board size
   */
  renderCell(cell: Cell, size: Size): string {
    const pivotX = cell.position.x * this.cellSize + (this.lineWidth / 2) + this.cellSize;
    const pivotY = cell.position.y * this.cellSize + (this.lineWidth / 2) + this.cellSize;
    let path = '';

    if (cell.hasWall(RectangularDirection.UP)) {
      // Top wall
      path += `M${pivotX},${pivotY}H${pivotX + this.cellSize}`;
    }

    if (cell.hasWall(RectangularDirection.LEFT)) {
      // Left wall
      path += `M${pivotX},${pivotY}V${pivotY + this.cellSize}`;
    }

    if (cell.position.x + 1 === size.width && cell.hasWall(RectangularDirection.RIGHT)) {
      // Right Wall
      path += `M${pivotX + this.cellSize},${pivotY}V${pivotY + this.cellSize}`;
    }

    if (cell.position.y + 1 === size.height) {
      // Bottom Wall
      path += `M${pivotX},${pivotY + this.cellSize}H${pivotX + this.cellSize}`;
    }

    return path;
  }
}
