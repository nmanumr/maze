import {Board} from "../core";

export interface IRenderer {
  render(board: Board): HTMLElement;
}
