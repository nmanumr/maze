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
