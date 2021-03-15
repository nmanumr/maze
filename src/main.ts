import {Generators} from './generators';
import renderersManager, {Renderers} from "./renderers";
import {watchKeyboard} from "./$browser/keyboard";
import {mountPlayer} from "./player";
import {merge} from "rxjs";
import {mountBoard, newBoard} from "./board/board$";

const keyboard$ = watchKeyboard();
const board$ = mountBoard();
const player$ = mountPlayer({keyboard$, board$});

const game$ = merge(
  player$,
  board$
)

board$.subscribe((board) => {
  renderersManager.loadRenderer(Renderers.rectangularSvg).then((render) => {
    document.getElementById('board').appendChild(
      render.render(board, player$)
    );
  })
})

game$.subscribe();

newBoard({
  height: 20,
  width: 20,
  generator: Generators.recursiveBackTrack,
})
