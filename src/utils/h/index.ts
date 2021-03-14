import {JSX as JSXInternal} from "preact"
import svgTags from "./svgTags";

type Child =
  | HTMLElement
  | Text
  | string
  | number

type Attributes =
  & JSXInternal.HTMLAttributes
  & JSXInternal.SVGAttributes
  & Record<string, any>


/**
 * Append a child node to an element
 *
 * @param el - Element
 * @param child - Child node(s)
 */
function appendChild(el: HTMLElement | SVGElement, child: Child | Child[]): void {
  /* Handle primitive types (including raw HTML) */
  if (typeof child === "string" || typeof child === "number") {
    el.innerHTML += child.toString()

    /* Handle nodes */
  } else if (child instanceof Node) {
    el.appendChild(child)

    /* Handle nested children */
  } else if (Array.isArray(child)) {
    for (const node of child)
      appendChild(el, node)
  }
}

/**
 * JSX factory
 *
 * @param tag - HTML tag
 * @param attributes - HTML attributes
 * @param children - Child elements
 *
 * @returns Element
 */
export function h(
  tag: string, attributes: Attributes | null, ...children: Child[]
): HTMLElement | SVGElement {
  let el;
  if (svgTags.includes(tag)) {
    el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  } else {
    el = document.createElement(tag);
  }


  /* Set attributes, if any */
  if (attributes) {
    for (const attr of Object.keys(attributes)) {
      if (typeof attributes[attr] !== "boolean") {
        el.setAttribute(attr, attributes[attr]);
      } else if (attributes[attr]) {
        el.setAttribute(attr, "");
      }
    }
  }

  /* Append child nodes */
  for (const child of children) {
    appendChild(el, child)
  }

  /* Return element */
  return el
}

export declare namespace h {
  namespace JSX {
    type Element = HTMLElement
    type IntrinsicElements = JSXInternal.IntrinsicElements
  }
}
