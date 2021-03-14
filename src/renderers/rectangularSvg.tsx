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

    return (
      <svg stroke="currentColor" fill="none" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {this.playerEl}
        {
          board.cells.map((value) => {
            return this.renderCell(value, board.size);
          }).flat()
        }
      </svg>
    );
  }

  renderPlayer() {
    const size = this.cellSize - (this.playerPadding * 2);
    return <rect width={size} height={size} fill="#3B82F6" stroke-width="0" rx="3" id="player"
                 x={1 + this.playerPadding} y={1 + this.playerPadding}/>;
  }

  renderCell(cell: Cell, size: ISize): HTMLElement[] {
    const pivotX = cell.position.x * this.cellSize + (this.lineWidth / 2);
    const pivotY = cell.position.y * this.cellSize + (this.lineWidth / 2);

    let lines = [];

    if (cell.hasWall(RectangularDirection.TOP)) {
      // Top wall
      lines.push(
        <path d={`M${pivotX},${pivotY} H${pivotX + this.cellSize}`}
              stroke-width={this.lineWidth} stroke-linecap="round"/>
      )
    }

    if (cell.hasWall(RectangularDirection.LEFT)) {
      // Left wall
      lines.push(
        <path d={`M${pivotX},${pivotY} V${pivotY + this.cellSize}`}
              stroke-width={this.lineWidth} stroke-linecap="round"/>
      )
    }

    if (cell.position.x + 1 === size.width && cell.hasWall(RectangularDirection.RIGHT)) {
      // Right Wall
      lines.push(
        <path d={`M${pivotX + this.cellSize},${pivotY} V${pivotY + this.cellSize}`}
              stroke-width={this.lineWidth} stroke-linecap="round"/>
      );
    }

    if (cell.position.y + 1 === size.height) {
      // Bottom Wall
      lines.push(
        <path d={`M${pivotX},${pivotY + this.cellSize} H${pivotX + this.cellSize}`}
              stroke-width={this.lineWidth} stroke-linecap="round"/>
      );
    }

    return lines;
  }
}
