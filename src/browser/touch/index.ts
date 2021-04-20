import {from, fromEvent, merge, NEVER, Observable} from "rxjs";
import {map, share, switchMap} from "rxjs/operators";
import {RectangularDirection} from "../../board";

export interface Swipe {
  dir: RectangularDirection;
}

/**
 * Watch swipe events on the given element using hammerjs
 */
export function watchSwipe(element = document.documentElement): Observable<Swipe> {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

  if (!isTouchDevice) {
    return NEVER;
  }

  return from(import('hammerjs'))
    .pipe(
      switchMap((hammer) => {
        const mc = new hammer.Manager(element);
        mc.add(new hammer.Swipe());

        return merge(
          fromEvent(mc, 'swipeleft'),
          fromEvent(mc, 'swiperight'),
          fromEvent(mc, 'swipeup'),
          fromEvent(mc, 'swipedown'),
        )
      }),
      map(({type}) => {
        return {dir: type.slice(5)};
      }),
      share(),
    )
}
