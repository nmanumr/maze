import {Board} from "../board";

export interface Generator {
  generate(board: Board): Board;
}
