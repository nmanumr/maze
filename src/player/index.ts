import {animationFrameScheduler, BehaviorSubject, Observable} from "rxjs";
import {IPosition} from "../utils";
import {Keyboard} from "../$browser/keyboard";
import {distinctUntilChanged, observeOn, tap, withLatestFrom} from "rxjs/operators";
import {Board, RectangularDirection} from "../board";

export interface MountOptions {
  keyboard$: Observable<Keyboard>;
  board$: Observable<Board>
}

export interface Player {
  visible: boolean;
  position: IPosition;
}

const keyMap = {
  'ArrowRight': RectangularDirection.RIGHT,
  'ArrowLeft': RectangularDirection.LEFT,
  'ArrowUp': RectangularDirection.TOP,
  'ArrowDown': RectangularDirection.BOTTOM,
}

export function mountPlayer(
  {keyboard$, board$}: MountOptions
): Observable<Player> {
  const $player = new BehaviorSubject<Player>({
    visible: true,
    position: {x: 0, y: 0}
  });

  keyboard$
    .pipe(
      withLatestFrom($player, board$),
      tap(([{type}, player, board]) => {
        let {x, y} = player.position;
        // @ts-ignore
        if (board.hasWall({x, y}, keyMap[type])) {
          return;
        }

        if (type === 'ArrowRight' && x < (board.size.width - 1)) {
          x++;
        } else if (type === 'ArrowLeft' && x > 0) {
          x--;
        } else if (type === 'ArrowUp' && y > 0) {
          y--;
        } else if (type === 'ArrowDown' && y < (board.size.height - 1)) {
          y++;
        }

        $player.next({
          visible: true,
          position: {x, y}
        });
      })
    ).subscribe()

  return $player.pipe(
    observeOn(animationFrameScheduler),
    distinctUntilChanged((a, b) => {
      return a.visible === b.visible
        && a.position.x === b.position.x
        && a.position.y === b.position.y;
    })
  )
}
