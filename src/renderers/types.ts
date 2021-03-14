import {Board} from "../board";

export interface IRenderer {
  render(board: Board): HTMLElement;
}
