import {Board} from "../board";
import {PlayerState} from "../player";
import {Observable} from "rxjs";

export interface IRenderer {
  render(board: Board, player$: Observable<PlayerState>): HTMLElement;
}
