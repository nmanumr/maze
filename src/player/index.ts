import {animationFrameScheduler, BehaviorSubject, Observable} from "rxjs";
import {IPosition} from "../utils";
import {Keyboard} from "../$browser/keyboard";
import {observeOn, tap, withLatestFrom} from "rxjs/operators";

export interface MountOptions {
  keyboard$: Observable<Keyboard>
}

export interface Player {
  visible: boolean;
  position: IPosition
}

export function mountPlayer(
  document: Document,
  {keyboard$}: MountOptions
): Observable<Player> {
  const $player = new BehaviorSubject<Player>({
    visible: true,
    position: {
      x: 0,
      y: 0
    }
  });

  keyboard$
    .pipe(
      withLatestFrom($player),
      tap(([{type}, player]) => {
        let {x, y} = player.position;
        switch (type) {
          case 'ArrowRight':
            x++;
            break;

          case 'ArrowLeft':
            x--;
            break;

          case 'ArrowUp':
            y--;
            break;

          case 'ArrowDown':
            y++;
            break;
        }

        $player.next({
          visible: true,
          position: {x, y}
        });
      })
    ).subscribe()

  return $player.pipe(
    observeOn(animationFrameScheduler),
  )
}
