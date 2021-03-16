import { _ as __extends, S as Subscriber } from './main.es.js';

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function skip(count) {
    return function (source) { return source.lift(new SkipOperator(count)); };
}
var SkipOperator = /*@__PURE__*/ (function () {
    function SkipOperator(total) {
        this.total = total;
    }
    SkipOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SkipSubscriber(subscriber, this.total));
    };
    return SkipOperator;
}());
var SkipSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(SkipSubscriber, _super);
    function SkipSubscriber(destination, total) {
        var _this = _super.call(this, destination) || this;
        _this.total = total;
        _this.count = 0;
        return _this;
    }
    SkipSubscriber.prototype._next = function (x) {
        if (++this.count > this.total) {
            this.destination.next(x);
        }
    };
    return SkipSubscriber;
}(Subscriber));

var svgTags = [
    "animate",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "color-profile",
    "defs",
    "desc",
    "discard",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "foreignObject",
    "g",
    "hatch",
    "hatchpath",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "mesh",
    "meshgradient",
    "meshpatch",
    "meshrow",
    "metadata",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "set",
    "solidColor",
    "stop",
    "style",
    "svg",
    "switch",
    "symbol",
    "text",
    "textPath",
    "tspan",
    "unknown",
    "use",
    "view"
];

/**
 * Append a child node to an element
 *
 * @param el - Element
 * @param child - Child node(s)
 */
function appendChild(el, child) {
    /* Handle primitive types (including raw HTML) */
    if (typeof child === "string" || typeof child === "number") {
        el.innerHTML += child.toString();
        /* Handle nodes */
    }
    else if (child instanceof Node) {
        el.appendChild(child);
        /* Handle nested children */
    }
    else if (Array.isArray(child)) {
        for (const node of child)
            appendChild(el, node);
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
function h(tag, attributes, ...children) {
    let el;
    if (svgTags.includes(tag)) {
        el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    }
    else {
        el = document.createElement(tag);
    }
    /* Set attributes, if any */
    if (attributes) {
        for (const attr of Object.keys(attributes)) {
            if (typeof attributes[attr] !== "boolean") {
                el.setAttribute(attr, attributes[attr]);
            }
            else if (attributes[attr]) {
                el.setAttribute(attr, "");
            }
        }
    }
    /* Append child nodes */
    for (const child of children) {
        appendChild(el, child);
    }
    /* Return element */
    return el;
}

class RectangularSvg {
    constructor() {
        this.cellSize = 30;
        this.lineWidth = 2;
        this.playerPadding = 7;
        let root = document.documentElement;
        root.style.setProperty('--cell-size', (this.cellSize + 1) + 'px');
    }
    render(board, player$) {
        const width = this.cellSize * board.size.width + this.lineWidth;
        const height = this.cellSize * board.size.height + this.lineWidth;
        this.playerEl = this.renderPlayer();
        player$
            .pipe(skip(1))
            .subscribe(({ position }) => {
            this.playerEl.setAttribute('x', `${(this.cellSize * position.x) + this.playerPadding}`);
            this.playerEl.setAttribute('y', `${(this.cellSize * position.y) + this.playerPadding}`);
        });
        let path = board.cells.map((value) => {
            return this.renderCell(value, board.size);
        }).join('');
        return (h("svg", { class: "max-w-full max-h-full", stroke: "currentColor", fill: "none", width: width, height: height, viewBox: `0 0 ${width} ${height}` },
            this.playerEl,
            h("path", { d: path, class: "maze-wall", "stroke-width": this.lineWidth, "stroke-linecap": "round" })));
    }
    renderPlayer() {
        const size = this.cellSize - (this.playerPadding * 2);
        return h("rect", { width: size, height: size, fill: "currentColor", class: "text-blue-500", "stroke-width": "0", rx: "3", id: "player", x: 1 + this.playerPadding, y: 1 + this.playerPadding });
    }
    renderCell(cell, size) {
        const pivotX = cell.position.x * this.cellSize + (this.lineWidth / 2);
        const pivotY = cell.position.y * this.cellSize + (this.lineWidth / 2);
        let path = '';
        if (cell.hasWall("up" /* UP */)) {
            // Top wall
            path += `M${pivotX},${pivotY}H${pivotX + this.cellSize}`;
        }
        if (cell.hasWall("left" /* LEFT */)) {
            // Left wall
            path += `M${pivotX},${pivotY}V${pivotY + this.cellSize}`;
        }
        if (cell.position.x + 1 === size.width && cell.hasWall("right" /* RIGHT */)) {
            // Right Wall
            path += `M${pivotX + this.cellSize},${pivotY}V${pivotY + this.cellSize}`;
        }
        if (cell.position.y + 1 === size.height) {
            // Bottom Wall
            path += `M${pivotX},${pivotY + this.cellSize}H${pivotX + this.cellSize}`;
        }
        return path;
        // return <path class="maze-wall" d={path.slice(0, -1)} stroke-width={this.lineWidth} stroke-linecap="round"/>;
    }
}

export default RectangularSvg;
//# sourceMappingURL=rectangularSvg.es.js.map
