import {watchKeyboard, watchSwipe} from "./browser";
import {Generators} from './generators';
import {newBoard, resetBoard} from "./board";
import {fromEvent} from "rxjs";
import {mountGame} from "./game";

/*
 * References to some required document elements
 * Technically this should be done after DOM Content Loaded
 * But for some reason its working :)
 */
const boardEl = document.getElementById('board');
const boardWrapperEl = document.getElementById('boardWrapper');
const ResetEl = document.getElementById('reset');


/* initialize all the observables */
const keyboard$ = watchKeyboard();
const swipe$ = watchSwipe(boardWrapperEl);

mountGame({keyboard$, swipe$, boardEl});

/*
 * Initialize board with initial options.
 * Every other price of the board depends on
 * some non-null value of board option
 */
newBoard({
  height: 6,
  width: 6,
  generator: Generators.Wilson,
});


/* Bind events with buttons */
fromEvent(ResetEl, 'click')
  .subscribe(resetBoard);
