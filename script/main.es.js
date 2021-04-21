import{f as e,a as t,m as i,s as l,N as s,b as n,c as o,d as r,B as a,e as h,o as c,w as u,g as d}from"./rxjs.es.js";var g=["circle","defs","ellipse","filter","g","line","path","rect","svg"];function p(e,t){if("string"==typeof t||"number"==typeof t)e.innerHTML+=t.toString();else if(t instanceof Node)e.appendChild(t);else if(Array.isArray(t))for(const i of t)p(e,i)}function f(e,t,...i){let l;if(l=g.includes(e)?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e),t)for(const e of Object.keys(t))"boolean"!=typeof t[e]?l.setAttribute(e,t[e]):t[e]&&l.setAttribute(e,"");for(const e of i)p(l,e);return l}function m(e,t){return e.y*t+e.x}function w(e){return`${e.x}-${e.y}`}function y(e){let t,i,l=e.length;for(;0!==l;)i=Math.floor(Math.random()*l),l-=1,t=e[l],e[l]=e[i],e[i]=t;return e}class v{getSetFromCell(e,t){for(let i of t)if(i[w(e.position)])return i}joinCellSets(e,t,i){const l=this.getSetFromCell(e,i),s=this.getSetFromCell(t,i);if(l||s)if(null==l)s[w(e.position)]=e;else if(null==s)l[w(t.position)]=t;else{Object.assign(l,s);const e=i.indexOf(s);i.splice(e,1)}else i.push({[w(e.position)]:e,[w(t.position)]:t})}isFromSameSet(e,t,i){const l=this.getSetFromCell(e,i),s=this.getSetFromCell(t,i);return!!l&&!!s&&l==s}}const C={recursiveBackTrack:new class{generate(e){(e=e.clone()).cells[0].removeWall("left"),e.cells[e.cells.length-1].removeWall("right");const t=new Set,i=e.getRandomCell();return this.visitCell(i,t,e),e}visitCell(e,t,i){t.add(w(e.position));const l=Array.from(i.getNeighbourCells(e.position).values());for(;0!==l.length;){const s=Math.round(Math.random()*(l.length-1)),n=l[s];t.has(w(n.position))||(i.removeInterWall(e.position,n.position),this.visitCell(n,t,i)),l.splice(s,1)}}},AldousBroder:new class{generate(e){(e=e.clone()).cells[0].removeWall("left"),e.cells[e.cells.length-1].removeWall("right");let t=e.getRandomCell();const i=new Set;let l;for(i.add(w(t.position));i.size<e.size.height*e.size.width;){const s=Array.from(e.getNeighbourCells(t.position).values());if(s.filter((e=>!i.has(w(e.position)))).length>0){let n=s[Math.round((s.length-1)*Math.random())];i.has(w(n.position))||(e.removeInterWall(n.position,t.position),i.add(w(n.position)),l=null),t=n}else{if(!l){const t=e.cells.filter((e=>!i.has(w(e.position))));l=t[Math.round((t.length-1)*Math.random())]}let s=Math.sign(l.position.x-t.position.x),n=0===s?Math.sign(l.position.y-t.position.y):0;t=e.getCell({x:t.position.x+s,y:t.position.y+n})}}return e}},BinaryTree:new class{generate(e){(e=e.clone()).cells[0].removeWall("left"),e.cells[e.cells.length-1].removeWall("right");const t=Math.random()>.5,i=Math.random()>.5;for(let l of e.cells){let s=Array.from(e.getNeighbourCells(l.position).values());if(s=s.filter((s=>{const n=e.getRelativeDirection(l.position,s.position);return i&&"left"==n||!i&&"right"==n||t&&"down"==n||!t&&"up"==n})),s.length>0){const t=s[Math.round((s.length-1)*Math.random())];e.removeInterWall(t.position,l.position)}}return e}},Eller:new class extends v{generate(e){(e=e.clone()).cells[0].removeWall("left"),e.cells[e.cells.length-1].removeWall("right");const t=[];for(let i=0;i<e.size.width;i++){const l=e.getCell({x:i,y:0});t.push({[w(l.position)]:l})}for(let i=0;i<e.size.height-1;i++)this.visitRow(i,!1,e,t),this.visitNextRow(i,e,t);return this.visitRow(e.size.height-1,!0,e,t),e}visitRow(e,t,i,l){for(let s=1;s<i.size.width;s++){const n=i.getCell({y:e,x:s-1}),o=i.getCell({y:e,x:s});this.isFromSameSet(n,o,l)||(Math.random()>.5||t?(i.removeInterWall(n.position,o.position),this.joinCellSets(n,o,l)):null==this.getSetFromCell(n,l)?l.push({[w(n.position)]:n}):null==this.getSetFromCell(o,l)&&l.push({[w(o.position)]:o}))}}visitNextRow(e,t,i){for(let l of i){let i=Object.entries(l).filter((([t,i])=>i.position.y===e)).map((([e,t])=>t));i=y(i);let s=1+Math.round(Math.random()*(i.length-1));for(let e=0;e<s;e++){const s=i[e],n=t.getCell({x:s.position.x,y:s.position.y+1});t.removeInterWall(s.position,n.position),l[w(n.position)]=n}}}},Kruskal:new class extends v{generate(e){(e=e.clone()).cells[0].removeWall("left"),e.cells[e.cells.length-1].removeWall("right");const t=[];for(let i of e.cells)t.push({[w(i.position)]:i});for(;t.length>1;){const i=e.getRandomCell(),l=Array.from(e.getNeighbourCells(i.position).values()),s=l[Math.round((l.length-1)*Math.random())];this.isFromSameSet(i,s,t)||(e.removeInterWall(i.position,s.position),this.joinCellSets(i,s,t))}return e}}},W={left:"right",right:"left",up:"down",down:"up"};class x{constructor(e){this.position=e,this.walls=new Map,this.setAllWalls()}setAllWalls(){this.setWall("up"),this.setWall("right"),this.setWall("down"),this.setWall("left")}removeAllWalls(){this.removeWall("up"),this.removeWall("right"),this.removeWall("down"),this.removeWall("left")}setWall(e){this.walls.set(e,!0)}removeWall(e){this.walls.set(e,!1)}hasWall(e){return this.walls.get(e)}clone(){const e=new x(this.position);for(const[t,i]of this.walls.entries())e.walls.set(t,i);return e}}class z{constructor(e,t){this.size={height:t,width:e},this.cells=[],this.initCells()}initCells(){for(let e=0;e<this.size.height;e++)for(let t=0;t<this.size.width;t++)this.cells.push(new x({x:t,y:e}))}getRandomCell(){return this.cells[Math.round(Math.random()*(this.cells.length-1))]}getCell(e){return this.cells[m(e,this.size.width)]}getNeighbourCells(e,t=!1){let i=new Map,l=m(e,this.size.width);if(l>=this.size.width){const e=this.cells[l-this.size.width];i.set("up",e)}if((l+1)%this.size.width!=0){const e=this.cells[l+1];i.set("right",e)}if(l<this.cells.length-this.size.width){const e=this.cells[l+this.size.width];i.set("down",e)}if(l%this.size.width!=0){const e=this.cells[l-1];i.set("left",e)}if(t){const t=Array.from(i.entries()).filter((([t,i])=>!this.hasInterWall(i.position,e)));i=new Map(t)}return i}getNeighbourCell(e,t){return this.getNeighbourCells(e).get(t)}getRelativeDirection(e,t){if(e.y===t.y+1)return"up";if(e.x===t.x-1)return"right";if(e.x===t.x+1)return"left";if(e.y===t.y-1)return"down";throw`'${e}' and '${t}' are not neighbours`}removeInterWall(e,t){const i=this.getRelativeDirection(e,t),l=W[i];this.getCell(e).removeWall(i),this.getCell(t).removeWall(l)}addInterWall(e,t){const i=this.getRelativeDirection(e,t),l=W[i];this.getCell(e).setWall(i),this.getCell(t).setWall(l)}hasInterWall(e,t){const i=this.getRelativeDirection(e,t),l=W[i];return this.getCell(e).hasWall(i)&&this.getCell(t).hasWall(l)}isConnected(e,t){const i=this.getRelativeDirection(e,t),l=W[i];return this.getCell(e).hasWall(i)&&this.getCell(t).hasWall(l)}hasWall(e,t){return this.getCell(e).hasWall(t)}clone(){const e=new z(this.size.width,this.size.height);for(let t=0;t<e.cells.length;t++)e.cells[t]=this.cells[t].clone();return e}}const b=new a(null);function S(){b.next(b.getValue())}function M({x:e,y:t}){const{width:i,height:l}=b.getValue();return e===i-1&&t===l-1}function $(){return b.pipe(t((e=>!!e)),h((async({width:e,height:t,generator:i})=>{let l=new z(e,t);return i.generate(l)})),l())}class A{constructor(){this.cellSize=30,this.lineWidth=2,this.playerPadding=7,document.documentElement.style.setProperty("--cell-size",this.cellSize+"px")}render(e,t){const i=this.cellSize*(e.size.width+2)+this.lineWidth,l=this.cellSize*(e.size.height+2)+this.lineWidth,s=this.renderPlayer();t.subscribe((({position:e})=>{const[t,i]=[e.x,e.y].map((e=>this.cellSize*e+this.playerPadding+this.cellSize));s.setAttribute("x",t+""),s.setAttribute("y",i+"")}));let n=e.cells.map((t=>this.renderCell(t,e.size))).join("");return f("svg",{stroke:"currentColor",fill:"none",width:i,height:l,viewBox:`0 0 ${i} ${l}`},s,f("path",{d:n,class:"maze-wall","stroke-width":this.lineWidth,"stroke-linecap":"round"}))}renderPlayer(){const e=this.cellSize-2*this.playerPadding;return f("rect",{width:e,height:e,fill:"currentColor",class:"text-blue-500","stroke-width":"0",rx:"3",id:"player",x:1+this.playerPadding+this.cellSize,y:1+this.playerPadding+this.cellSize})}renderCell(e,t){const i=e.position.x*this.cellSize+this.lineWidth/2+this.cellSize,l=e.position.y*this.cellSize+this.lineWidth/2+this.cellSize;let s="";return e.hasWall("up")&&(s+=`M${i},${l}H${i+this.cellSize}`),e.hasWall("left")&&(s+=`M${i},${l}V${l+this.cellSize}`),e.position.x+1===t.width&&e.hasWall("right")&&(s+=`M${i+this.cellSize},${l}V${l+this.cellSize}`),e.position.y+1===t.height&&(s+=`M${i},${l+this.cellSize}H${i+this.cellSize}`),s}}var E;!function(e){e[e.rectangularSvg=0]="rectangularSvg"}(E||(E={}));var R=new class{constructor(){this.renderers=new Map}async loadRenderer(e){if(this.renderers.has(e))return this.renderers.get(e);let t;switch(e){case E.rectangularSvg:t=A}const i=new t;return this.renderers.set(e,i),i}};const k={ArrowRight:"right",ArrowLeft:"left",ArrowUp:"up",ArrowDown:"down"},N=new a({state:"active",position:{x:0,y:0}});function I(e){const{state:t}=N.getValue();N.next({state:t,position:e})}function T(e){const{position:t}=N.getValue();N.next({state:e,position:t})}function P({keyboard$:e,swipe$:l,board$:s}){s.subscribe((()=>{const{position:{x:e,y:t}}=N.getValue();0===e&&0===t||I({x:0,y:0})}));return r(e,l).pipe(i((e=>e.type?{dir:k[e.type]}:e))).pipe(u(s),t((([{dir:e},t])=>{const{position:{x:i,y:l},state:s}=N.getValue();return"active"===s&&!t.hasWall({x:i,y:l},e)}))).subscribe((([{dir:e},t])=>{!function(e,t){let{position:{x:i,y:l}}=N.getValue();for(;;){"right"===e&&i<t.size.width-1?i++:"left"===e&&i>0?i--:"up"===e&&l>0?l--:"down"===e&&l<t.size.height-1&&l++;const s=t.getNeighbourCells({x:i,y:l},!0);if(!s.has(e)||s.size>2)break}I({x:i,y:l})}(e,t)})),N.pipe(c(d))}const j=document.getElementById("board"),D=document.getElementById("boardWrapper"),F=document.getElementById("reset");var B;!function({keyboard$:e,swipe$:i,boardEl:l}){!function(e){e.subscribe((({type:e})=>{"r"===e.toLowerCase()&&S()}))}(e);const s=$(),n=P({keyboard$:e,board$:s,swipe$:i});s.subscribe((e=>{T("active"),R.loadRenderer(E.rectangularSvg).then((t=>{!function(e){for(;e.lastElementChild;)e.removeChild(e.lastElementChild)}(l),l.appendChild(t.render(e,n))}))})),n.pipe(t((({position:e,state:t})=>M(e)&&"active"===t))).subscribe((async({position:{x:e,y:t}})=>{const i=(new Date).getTime();let l;T("inactive");try{const e=await import("./confetti.module.es.js");l=e.default}catch(e){console.error(e)}const s=(new Date).getTime()-i;s>=250?(I({x:e+1,y:t}),l&&l({origin:{y:.8},particleCount:100}).then()):setTimeout((()=>{I({x:e+1,y:t}),l&&l({origin:{y:.8},particleCount:100}).then()}),250-s)}))}({keyboard$:e(window,"keydown").pipe(t((e=>!(e.metaKey||e.ctrlKey))),i((e=>({type:e.key,claim(){e.preventDefault(),e.stopPropagation()}}))),t((()=>{const e=document.activeElement instanceof HTMLElement?document.activeElement:void 0;return void 0===e||!function(e){switch(e.tagName){case"INPUT":case"SELECT":case"TEXTAREA":return!0;default:return e.isContentEditable}}(e)})),l()),swipe$:function(t=document.documentElement){return"ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?n(import("./hammer.es.js").then((function(e){return e.h}))).pipe(o((i=>{const l=new i.Manager(t);return l.add(new i.Swipe),r(e(l,"swipeleft"),e(l,"swiperight"),e(l,"swipeup"),e(l,"swipedown"))})),i((({type:e})=>({dir:e.slice(5)}))),l()):s}(D),boardEl:j}),B={height:15,width:15,generator:C.recursiveBackTrack},b.next(B),e(F,"click").subscribe(S);
//# sourceMappingURL=main.es.js.map
