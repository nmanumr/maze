import Hammer from 'hammerjs';
import {fromEvent, merge, Observable} from "rxjs";
import {map, share} from "rxjs/operators";
import {RectangularDirection} from "../../board";

export interface Swipe {
  dir: RectangularDirection;
}

/**
 * Watch swipe events on the given element using hammerjs
 */
export function watchSwipe(element = document.documentElement): Observable<Swipe> {
  const mc = new Hammer.Manager(element);

  mc.add(new Hammer.Swipe());

  return merge(
    fromEvent(mc, 'swipeleft'),
    fromEvent(mc, 'swiperight'),
    fromEvent(mc, 'swipeup'),
    fromEvent(mc, 'swipedown'),
  ).pipe(
    map(({type}) => {
      return {dir: type.slice(5)};
    }),
    share(),
  )
}
