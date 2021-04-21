import {Board} from "../board";

export interface MazeGenerator {
  generate(board: Board): Board;
}
