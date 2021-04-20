import {Size} from "../utils";
import {Generator} from "../generators";
import renderersManager, {Renderers} from "../renderers";
import {Observable} from "rxjs";
import {Keyboard} from "../browser/keyboard";
import {Swipe} from "../browser/touch";
import {isLastCell, mountBoard, resetBoard} from "../board";
import {mountPlayer, setPlayerPosition, setPlayerState} from "../player";
import {removeElementChildren} from "../browser/element";
import {filter} from "rxjs/operators";
import {default as canvasConfetti} from "canvas-confetti";

export interface GameOptions {
  size: Size;
  generator: Generator;
  renderer: Renderers;
  interactive: boolean;
  showPlayer: boolean;
}

interface MountOptions {
  keyboard$: Observable<Keyboard>;
  swipe$: Observable<Swipe>;
  boardEl: HTMLElement;
}

/**
 * Handle keyboard shortcuts
 */
function registerShortcuts(keyboard$: Observable<Keyboard>) {
  keyboard$.subscribe(({type}) => {
    /* 'r' to reset game */
    if (type.toLowerCase() === 'r') {
      resetBoard();
    }
  })
}

export function mountGame({keyboard$, swipe$, boardEl}: MountOptions) {
  registerShortcuts(keyboard$);

  const board$ = mountBoard();
  const player$ = mountPlayer({keyboard$, board$, swipe$});

  /* render board whenever new board is emitted */
  board$
    .subscribe((board) => {
      setPlayerState('active');
      renderersManager.loadRenderer(Renderers.rectangularSvg).then((render) => {
        removeElementChildren(boardEl);
        boardEl.appendChild(
          render.render(board, player$)
        );
      })
    });

  player$
    .pipe(
      filter(({position, state}) => isLastCell(position) && state === 'active'),
    )
    .subscribe(async ({position: {x, y}}) => {
      const start = new Date().getTime();
      setPlayerState('inactive');

      let confetti: typeof canvasConfetti;
      try {
        const canvasConfetti = await import('canvas-confetti');
        confetti = canvasConfetti.default;
      } catch (e) {
        console.error(e);
      }

      const timeDiff = new Date().getTime() - start;
      if (timeDiff >= 250) {
        setPlayerPosition({x: x + 1, y});

        if (confetti)
          confetti({origin: {y: 0.8}, particleCount: 100}).then();
      } else {
        setTimeout(() => {
          setPlayerPosition({x: x + 1, y});
          if (confetti)
            confetti({origin: {y: 0.8}, particleCount: 100}).then();
        }, 250 - timeDiff);
      }
    });
}
