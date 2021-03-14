import {Board} from "../board";

export interface IGenerator {
  generate(board: Board): Board;
}
