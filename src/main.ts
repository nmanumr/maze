import {Generators} from './generators';
import renderersManager, {Renderers} from "./renderers";
import {watchKeyboard} from "./$browser/keyboard";
import {mountPlayer} from "./player";
import {fromEvent, merge} from "rxjs";
import {mountBoard, newBoard, resetBoard} from "./board/board$";

const keyboard$ = watchKeyboard();
const board$ = mountBoard();
const player$ = mountPlayer({keyboard$, board$});

board$.subscribe((board) => {
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
