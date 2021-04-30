// import {getNextRowNeighbours, getRows, rectangularBoard, removeInterWall} from "./boards/rectangular";
// import {generate} from "./generators/eller";
// import {render} from "./renderers/rectangular-svg";
//
// let board = rectangularBoard({width: 4, height: 4});
//
// board = generate(board, {
//   getNextRowNeighbours,
//   getRows,
//   removeInterWall
// });
//
// console.log(board);
// console.log(render(board));

import {circularBoard, getRows, getRelativeDirection, toPosition} from "./boards/circular";
import {render} from "./renderers/circular-svg";

let board = circularBoard(10);
// console.log(board);

const rows = getRows(board);
console.log(rows);

console.log(render(board));


console.log(getRelativeDirection(0, 8, board));

