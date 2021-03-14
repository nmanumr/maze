import {h} from "../utils";
import {IRenderer} from "./types";
import {Board, Cell, ISize, RectangularDirection} from "../board";

export default class RectangularSvg implements IRenderer {
  private cellSize = 30;
  private lineWidth = 2;

  render(board: Board): HTMLElement {
    const width = this.cellSize * board.size.width + this.lineWidth;
    const height = this.cellSize * board.size.height + this.lineWidth;

    return (
      <svg stroke="currentColor" fill="none" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {
          board.cells.map((value) => {
            return this.renderCell(value, board.size);
          }).flat()
        }
      </svg>
    );
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
          stroke-width={this.lineWidth} stroke-linecap="round" />
      );
    }

    if (cell.position.y + 1 === size.height) {
      // Bottom Wall
      lines.push(
        <path d={`M${pivotX},${pivotY + this.cellSize} H${pivotX + this.cellSize}`}
          stroke-width={this.lineWidth} stroke-linecap="round" />
      );
    }

    return lines;
  }
}
