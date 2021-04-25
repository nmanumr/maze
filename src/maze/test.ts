import {getNextRowNeighbours, getRows, rectangularBoard, removeInterWall} from "./rectangular";
import {generate} from "./generators/eller";
import {render} from "./renderers/rectangular-svg";

let board = rectangularBoard({width: 4, height: 4});

board = generate(board, {
  getNextRowNeighbours,
  getRows,
  removeInterWall
});

console.log(board);
console.log(render(board));
