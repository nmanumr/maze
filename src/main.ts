import {Generators} from './generators';
import renderersManager, {Renderers} from "./renderers";
import {watchKeyboard} from "./$browser/keyboard";
import {mountPlayer} from "./player";
import {animationFrameScheduler, fromEvent, merge} from "rxjs";
import {mountBoard, newBoard, resetBoard} from "./board/board$";
import {observeOn} from "rxjs/operators";

import {watchSwipe} from "./$browser/touch";

const boardWrapperEl = document.getElementById('boardWrapper');

const keyboard$ = watchKeyboard();
const swipe$ = watchSwipe(boardWrapperEl);
const board$ = mountBoard();
const player$ = mountPlayer({keyboard$, board$, swipe$});

board$
  .pipe(observeOn(animationFrameScheduler))
  .subscribe((board) => {
  renderersManager.loadRenderer(Renderers.rectangularSvg).then((render) => {
    const boardEl = document.getElementById('board');

    while (boardEl.lastElementChild) {
      boardEl.removeChild(boardEl.lastElementChild);
    }
    boardEl.appendChild(
      render.render(board, player$)
    );
  })
})

keyboard$.subscribe(({type}) => {
  if (type.toLowerCase() === 'r') {
    resetBoard();
  }
})

const game$ = merge(
  player$,
  board$
)

fromEvent(document, 'DOMContentLoaded').subscribe(() => {
  newBoard({
    height: 20,
    width: 20,
    generator: Generators.recursiveBackTrack,
  });

  game$.subscribe();

  const ResetEl = document.getElementById('reset');
  fromEvent(ResetEl, 'click')
    .subscribe(resetBoard);
})
