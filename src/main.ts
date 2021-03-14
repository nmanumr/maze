import {Board} from "./core";
import generatorsManager, {Generators} from './generators';
import renderersManager, {Renderers} from "./renderers";

let board = new Board(20, 20);

generatorsManager.loadGenerator(Generators.recursiveBackTrack).then((generator) => {
  board = generator.generate(board);

  renderersManager.loadRenderer(Renderers.rectangularSvg).then((render) => {
    document.getElementById('board').appendChild(render.render(board));
  })
})


