/**
 * Retrieve the currently active element
 *
 * @returns Element or nothing
 */
export function getActiveElement(): HTMLElement | undefined {
  return document.activeElement instanceof HTMLElement
    ? document.activeElement
    : undefined
}


/**
 * Remove all the children of given element
 */
export function removeElementChildren(element: HTMLElement): void {
  while (element.lastElementChild) {
    element.removeChild(element.lastElementChild);
  }
}
