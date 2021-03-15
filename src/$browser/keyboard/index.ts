import {fromEvent, Observable} from "rxjs";
import {filter, map, share} from "rxjs/operators";
import {getActiveElement} from "../element";

/**
 * Keyboard
 */
export interface Keyboard {
  type: string                         /* Key type */
  claim(): void                        /* Key claim */
}

/**
 * Check whether an element may receive keyboard input
 *
 * @param el - Element
 *
 * @returns Test result
 */
function isSusceptibleToKeyboard(el: HTMLElement): boolean {
  switch (el.tagName) {
    /* Form elements */
    case "INPUT":
    case "SELECT":
    case "TEXTAREA":
      return true

    /* Everything else */
    default:
      return el.isContentEditable
  }
}

/**
 * Watch keyboard
 *
 * @returns Keyboard observable
 */
export function watchKeyboard(): Observable<Keyboard> {
  return fromEvent<KeyboardEvent>(window, "keydown")
    .pipe(
      filter(ev => !(ev.metaKey || ev.ctrlKey)),
      map(ev => ({
        type: ev.key,
        claim() {
          ev.preventDefault()
          ev.stopPropagation()
        }
      } as Keyboard)),
      filter(() => {
        const active = getActiveElement()
        if (typeof active !== "undefined")
          return !isSusceptibleToKeyboard(active)

        return true
      }),
      share(),
    )
}
