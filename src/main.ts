import {watchKeyboard, watchSwipe} from "./browser$";
import {animationFrameScheduler, fromEvent} from "rxjs";
import {Generators} from './generators';
import renderersManager, {Renderers} from "./renderers";
import {mountPlayer} from "./player";
import {mountBoard, newBoard, resetBoard} from "./board/board$";
import {observeOn} from "rxjs/operators";


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
const board$ = mountBoard();
const player$ = mountPlayer({keyboard$, board$, swipe$});


/* render board whenever new board is emitted */
board$
  .pipe(observeOn(animationFrameScheduler))
  .subscribe((board) => {
  renderersManager.loadRenderer(Renderers.rectangularSvg).then((render) => {

    while (boardEl.lastElementChild) {
      boardEl.removeChild(boardEl.lastElementChild);
    }
    boardEl.appendChild(
      render.render(board, player$)
    );
  })
})


/* handle keyboard shortcuts like 'r' to reset game */
keyboard$.subscribe(({type}) => {
  if (type.toLowerCase() === 'r') {
    resetBoard();
  }
})

/*
 * Initialize board with initial options.
 * Every other price of the board depends on
 * some non-null value of board option
 */
newBoard({
  height: 20,
  width: 20,
  generator: Generators.recursiveBackTrack,
});


/* Bind events with buttons */
fromEvent(ResetEl, 'click')
  .subscribe(resetBoard);
