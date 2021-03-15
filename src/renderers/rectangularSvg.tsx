import {h} from "../utils";
import {IRenderer} from "./types";
import {Board, Cell, ISize, RectangularDirection} from "../board";
import {Observable} from "rxjs";
import {Player} from "../player";
import {skip} from "rxjs/operators";

export default class RectangularSvg implements IRenderer {
  private cellSize = 30;
  private lineWidth = 2;
  private playerPadding = 7;
  private playerEl: HTMLElement;

  constructor() {
    let root = document.documentElement;
    root.style.setProperty('--cell-size', (this.cellSize + 1) + 'px');
  }

  render(board: Board, player$: Observable<Player>): HTMLElement {
    const width = this.cellSize * board.size.width + this.lineWidth;
    const height = this.cellSize * board.size.height + this.lineWidth;
    this.playerEl = this.renderPlayer();

    player$
      .pipe(skip(1))
      .subscribe(({position}) => {
        this.playerEl.setAttribute('x', `${(this.cellSize * position.x) + this.playerPadding}`);
        this.playerEl.setAttribute('y', `${(this.cellSize * position.y) + this.playerPadding}`);
      })

    let path = board.cells.map((value) => {
      return this.renderCell(value, board.size);
    }).join('');

    return (
      <svg class="max-w-full max-h-full" stroke="currentColor" fill="none"
           width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {this.playerEl}
        <path d={path} class="maze-wall" stroke-width={this.lineWidth} stroke-linecap="round"/>
      </svg>
    );
  }

  renderPlayer() {
    const size = this.cellSize - (this.playerPadding * 2);
    return <rect width={size} height={size} fill="currentColor"
                 class="text-blue-500"
                 stroke-width="0" rx="3" id="player"
                 x={1 + this.playerPadding} y={1 + this.playerPadding}/>;
  }

  renderCell(cell: Cell, size: ISize): string {
    const pivotX = cell.position.x * this.cellSize + (this.lineWidth / 2);
    const pivotY = cell.position.y * this.cellSize + (this.lineWidth / 2);
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

    // return <path class="maze-wall" d={path.slice(0, -1)} stroke-width={this.lineWidth} stroke-linecap="round"/>;
  }
}
