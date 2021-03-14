import {Board} from "../board";
import {Player} from "../player";
import {Observable} from "rxjs";

export interface IRenderer {
  render(board: Board, player$: Observable<Player>): HTMLElement;
}
