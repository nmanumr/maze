import {Board} from "../core";

export interface IGenerator {
  generate(board: Board): Board;
}
