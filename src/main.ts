import {Board} from "./board";
import generatorsManager, {Generators} from './generators';
import renderersManager, {Renderers} from "./renderers";
import {watchKeyboard} from "./$browser/keyboard";
import {mountPlayer} from "./player";
import {merge} from "rxjs";

const keyboard$ = watchKeyboard();
const player$ = mountPlayer(document, {keyboard$});

const game$ = merge(
  player$
)

game$.subscribe();

let board = new Board(20, 20);

generatorsManager.loadGenerator(Generators.recursiveBackTrack).then((generator) => {
  board = generator.generate(board);

  renderersManager.loadRenderer(Renderers.rectangularSvg).then((render) => {
    document.getElementById('board').appendChild(
      render.render(board, player$)
    );
  })
})


