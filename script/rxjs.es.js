/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var t=function(n,e){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e])})(n,e)};function n(n,e){function r(){this.constructor=n}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}function e(t){return"function"==typeof t}var r=!1,i={Promise:void 0,set useDeprecatedSynchronousErrorHandling(t){t&&(new Error).stack;r=t},get useDeprecatedSynchronousErrorHandling(){return r}};function o(t){setTimeout((function(){throw t}),0)}var s={closed:!0,next:function(t){},error:function(t){if(i.useDeprecatedSynchronousErrorHandling)throw t;o(t)},complete:function(){}},u=function(){return Array.isArray||function(t){return t&&"number"==typeof t.length}}();function c(t){return null!==t&&"object"==typeof t}var h=function(){function t(t){return Error.call(this),this.message=t?t.length+" errors occurred during unsubscription:\n"+t.map((function(t,n){return n+1+") "+t.toString()})).join("\n  "):"",this.name="UnsubscriptionError",this.errors=t,this}return t.prototype=Object.create(Error.prototype),t}(),a=function(){function t(t){this.closed=!1,this._parentOrParents=null,this._subscriptions=null,t&&(this._ctorUnsubscribe=!0,this._unsubscribe=t)}return t.prototype.unsubscribe=function(){var n;if(!this.closed){var r=this,i=r._parentOrParents,o=r._ctorUnsubscribe,s=r._unsubscribe,a=r._subscriptions;if(this.closed=!0,this._parentOrParents=null,this._subscriptions=null,i instanceof t)i.remove(this);else if(null!==i)for(var l=0;l<i.length;++l){i[l].remove(this)}if(e(s)){o&&(this._unsubscribe=void 0);try{s.call(this)}catch(t){n=t instanceof h?f(t.errors):[t]}}if(u(a)){l=-1;for(var p=a.length;++l<p;){var d=a[l];if(c(d))try{d.unsubscribe()}catch(t){n=n||[],t instanceof h?n=n.concat(f(t.errors)):n.push(t)}}}if(n)throw new h(n)}},t.prototype.add=function(n){var e=n;if(!n)return t.EMPTY;switch(typeof n){case"function":e=new t(n);case"object":if(e===this||e.closed||"function"!=typeof e.unsubscribe)return e;if(this.closed)return e.unsubscribe(),e;if(!(e instanceof t)){var r=e;(e=new t)._subscriptions=[r]}break;default:throw new Error("unrecognized teardown "+n+" added to Subscription.")}var i=e._parentOrParents;if(null===i)e._parentOrParents=this;else if(i instanceof t){if(i===this)return e;e._parentOrParents=[i,this]}else{if(-1!==i.indexOf(this))return e;i.push(this)}var o=this._subscriptions;return null===o?this._subscriptions=[e]:o.push(e),e},t.prototype.remove=function(t){var n=this._subscriptions;if(n){var e=n.indexOf(t);-1!==e&&n.splice(e,1)}},t.EMPTY=function(t){return t.closed=!0,t}(new t),t}();function f(t){return t.reduce((function(t,n){return t.concat(n instanceof h?n.errors:n)}),[])}var l=function(){return"function"==typeof Symbol?Symbol("rxSubscriber"):"@@rxSubscriber_"+Math.random()}(),p=function(t){function e(n,r,i){var o=t.call(this)||this;switch(o.syncErrorValue=null,o.syncErrorThrown=!1,o.syncErrorThrowable=!1,o.isStopped=!1,arguments.length){case 0:o.destination=s;break;case 1:if(!n){o.destination=s;break}if("object"==typeof n){n instanceof e?(o.syncErrorThrowable=n.syncErrorThrowable,o.destination=n,n.add(o)):(o.syncErrorThrowable=!0,o.destination=new d(o,n));break}default:o.syncErrorThrowable=!0,o.destination=new d(o,n,r,i)}return o}return n(e,t),e.prototype[l]=function(){return this},e.create=function(t,n,r){var i=new e(t,n,r);return i.syncErrorThrowable=!1,i},e.prototype.next=function(t){this.isStopped||this._next(t)},e.prototype.error=function(t){this.isStopped||(this.isStopped=!0,this._error(t))},e.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},e.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,t.prototype.unsubscribe.call(this))},e.prototype._next=function(t){this.destination.next(t)},e.prototype._error=function(t){this.destination.error(t),this.unsubscribe()},e.prototype._complete=function(){this.destination.complete(),this.unsubscribe()},e.prototype._unsubscribeAndRecycle=function(){var t=this._parentOrParents;return this._parentOrParents=null,this.unsubscribe(),this.closed=!1,this.isStopped=!1,this._parentOrParents=t,this},e}(a),d=function(t){function r(n,r,i,o){var u,c=t.call(this)||this;c._parentSubscriber=n;var h=c;return e(r)?u=r:r&&(u=r.next,i=r.error,o=r.complete,r!==s&&(e((h=Object.create(r)).unsubscribe)&&c.add(h.unsubscribe.bind(h)),h.unsubscribe=c.unsubscribe.bind(c))),c._context=h,c._next=u,c._error=i,c._complete=o,c}return n(r,t),r.prototype.next=function(t){if(!this.isStopped&&this._next){var n=this._parentSubscriber;i.useDeprecatedSynchronousErrorHandling&&n.syncErrorThrowable?this.__tryOrSetError(n,this._next,t)&&this.unsubscribe():this.__tryOrUnsub(this._next,t)}},r.prototype.error=function(t){if(!this.isStopped){var n=this._parentSubscriber,e=i.useDeprecatedSynchronousErrorHandling;if(this._error)e&&n.syncErrorThrowable?(this.__tryOrSetError(n,this._error,t),this.unsubscribe()):(this.__tryOrUnsub(this._error,t),this.unsubscribe());else if(n.syncErrorThrowable)e?(n.syncErrorValue=t,n.syncErrorThrown=!0):o(t),this.unsubscribe();else{if(this.unsubscribe(),e)throw t;o(t)}}},r.prototype.complete=function(){var t=this;if(!this.isStopped){var n=this._parentSubscriber;if(this._complete){var e=function(){return t._complete.call(t._context)};i.useDeprecatedSynchronousErrorHandling&&n.syncErrorThrowable?(this.__tryOrSetError(n,e),this.unsubscribe()):(this.__tryOrUnsub(e),this.unsubscribe())}else this.unsubscribe()}},r.prototype.__tryOrUnsub=function(t,n){try{t.call(this._context,n)}catch(t){if(this.unsubscribe(),i.useDeprecatedSynchronousErrorHandling)throw t;o(t)}},r.prototype.__tryOrSetError=function(t,n,e){if(!i.useDeprecatedSynchronousErrorHandling)throw new Error("bad call");try{n.call(this._context,e)}catch(n){return i.useDeprecatedSynchronousErrorHandling?(t.syncErrorValue=n,t.syncErrorThrown=!0,!0):(o(n),!0)}return!1},r.prototype._unsubscribe=function(){var t=this._parentSubscriber;this._context=null,this._parentSubscriber=null,t.unsubscribe()},r}(p);var b=function(){return"function"==typeof Symbol&&Symbol.observable||"@@observable"}();function y(t){return t}function v(t){return 0===t.length?y:1===t.length?t[0]:function(n){return t.reduce((function(t,n){return n(t)}),n)}}var _=function(){function t(t){this._isScalar=!1,t&&(this._subscribe=t)}return t.prototype.lift=function(n){var e=new t;return e.source=this,e.operator=n,e},t.prototype.subscribe=function(t,n,e){var r=this.operator,o=function(t,n,e){if(t){if(t instanceof p)return t;if(t[l])return t[l]()}return t||n||e?new p(t,n,e):new p(s)}(t,n,e);if(r?o.add(r.call(o,this.source)):o.add(this.source||i.useDeprecatedSynchronousErrorHandling&&!o.syncErrorThrowable?this._subscribe(o):this._trySubscribe(o)),i.useDeprecatedSynchronousErrorHandling&&o.syncErrorThrowable&&(o.syncErrorThrowable=!1,o.syncErrorThrown))throw o.syncErrorValue;return o},t.prototype._trySubscribe=function(t){try{return this._subscribe(t)}catch(n){i.useDeprecatedSynchronousErrorHandling&&(t.syncErrorThrown=!0,t.syncErrorValue=n),!function(t){for(;t;){var n=t,e=n.closed,r=n.destination,i=n.isStopped;if(e||i)return!1;t=r&&r instanceof p?r:null}return!0}(t)?console.warn(n):t.error(n)}},t.prototype.forEach=function(t,n){var e=this;return new(n=w(n))((function(n,r){var i;i=e.subscribe((function(n){try{t(n)}catch(t){r(t),i&&i.unsubscribe()}}),r,n)}))},t.prototype._subscribe=function(t){var n=this.source;return n&&n.subscribe(t)},t.prototype[b]=function(){return this},t.prototype.pipe=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return 0===t.length?this:v(t)(this)},t.prototype.toPromise=function(t){var n=this;return new(t=w(t))((function(t,e){var r;n.subscribe((function(t){return r=t}),(function(t){return e(t)}),(function(){return t(r)}))}))},t.create=function(n){return new t(n)},t}();function w(t){if(t||(t=Promise),!t)throw new Error("no Promise impl found");return t}var m=function(){function t(){return Error.call(this),this.message="object unsubscribed",this.name="ObjectUnsubscribedError",this}return t.prototype=Object.create(Error.prototype),t}(),g=function(t){function e(n,e){var r=t.call(this)||this;return r.subject=n,r.subscriber=e,r.closed=!1,r}return n(e,t),e.prototype.unsubscribe=function(){if(!this.closed){this.closed=!0;var t=this.subject,n=t.observers;if(this.subject=null,n&&0!==n.length&&!t.isStopped&&!t.closed){var e=n.indexOf(this.subscriber);-1!==e&&n.splice(e,1)}}},e}(a),E=function(t){function e(n){var e=t.call(this,n)||this;return e.destination=n,e}return n(e,t),e}(p),x=function(t){function e(){var n=t.call(this)||this;return n.observers=[],n.closed=!1,n.isStopped=!1,n.hasError=!1,n.thrownError=null,n}return n(e,t),e.prototype[l]=function(){return new E(this)},e.prototype.lift=function(t){var n=new S(this,this);return n.operator=t,n},e.prototype.next=function(t){if(this.closed)throw new m;if(!this.isStopped)for(var n=this.observers,e=n.length,r=n.slice(),i=0;i<e;i++)r[i].next(t)},e.prototype.error=function(t){if(this.closed)throw new m;this.hasError=!0,this.thrownError=t,this.isStopped=!0;for(var n=this.observers,e=n.length,r=n.slice(),i=0;i<e;i++)r[i].error(t);this.observers.length=0},e.prototype.complete=function(){if(this.closed)throw new m;this.isStopped=!0;for(var t=this.observers,n=t.length,e=t.slice(),r=0;r<n;r++)e[r].complete();this.observers.length=0},e.prototype.unsubscribe=function(){this.isStopped=!0,this.closed=!0,this.observers=null},e.prototype._trySubscribe=function(n){if(this.closed)throw new m;return t.prototype._trySubscribe.call(this,n)},e.prototype._subscribe=function(t){if(this.closed)throw new m;return this.hasError?(t.error(this.thrownError),a.EMPTY):this.isStopped?(t.complete(),a.EMPTY):(this.observers.push(t),new g(this,t))},e.prototype.asObservable=function(){var t=new _;return t.source=this,t},e.create=function(t,n){return new S(t,n)},e}(_),S=function(t){function e(n,e){var r=t.call(this)||this;return r.destination=n,r.source=e,r}return n(e,t),e.prototype.next=function(t){var n=this.destination;n&&n.next&&n.next(t)},e.prototype.error=function(t){var n=this.destination;n&&n.error&&this.destination.error(t)},e.prototype.complete=function(){var t=this.destination;t&&t.complete&&this.destination.complete()},e.prototype._subscribe=function(t){return this.source?this.source.subscribe(t):a.EMPTY},e}(x);function j(){return function(t){return t.lift(new I(t))}}var I=function(){function t(t){this.connectable=t}return t.prototype.call=function(t,n){var e=this.connectable;e._refCount++;var r=new T(t,e),i=n.subscribe(r);return r.closed||(r.connection=e.connect()),i},t}(),T=function(t){function e(n,e){var r=t.call(this,n)||this;return r.connectable=e,r}return n(e,t),e.prototype._unsubscribe=function(){var t=this.connectable;if(t){this.connectable=null;var n=t._refCount;if(n<=0)this.connection=null;else if(t._refCount=n-1,n>1)this.connection=null;else{var e=this.connection,r=t._connection;this.connection=null,!r||e&&r!==e||r.unsubscribe()}}else this.connection=null},e}(p),O=function(t){function e(n,e){var r=t.call(this)||this;return r.source=n,r.subjectFactory=e,r._refCount=0,r._isComplete=!1,r}return n(e,t),e.prototype._subscribe=function(t){return this.getSubject().subscribe(t)},e.prototype.getSubject=function(){var t=this._subject;return t&&!t.isStopped||(this._subject=this.subjectFactory()),this._subject},e.prototype.connect=function(){var t=this._connection;return t||(this._isComplete=!1,(t=this._connection=new a).add(this.source.subscribe(new P(this.getSubject(),this))),t.closed&&(this._connection=null,t=a.EMPTY)),t},e.prototype.refCount=function(){return j()(this)},e}(_),N=function(){var t=O.prototype;return{operator:{value:null},_refCount:{value:0,writable:!0},_subject:{value:null,writable:!0},_connection:{value:null,writable:!0},_subscribe:{value:t._subscribe},_isComplete:{value:t._isComplete,writable:!0},getSubject:{value:t.getSubject},connect:{value:t.connect},refCount:{value:t.refCount}}}(),P=function(t){function e(n,e){var r=t.call(this,n)||this;return r.connectable=e,r}return n(e,t),e.prototype._error=function(n){this._unsubscribe(),t.prototype._error.call(this,n)},e.prototype._complete=function(){this.connectable._isComplete=!0,this._unsubscribe(),t.prototype._complete.call(this)},e.prototype._unsubscribe=function(){var t=this.connectable;if(t){this.connectable=null;var n=t._connection;t._refCount=0,t._subject=null,t._connection=null,n&&n.unsubscribe()}},e}(E),A=function(t){function e(n){var e=t.call(this)||this;return e._value=n,e}return n(e,t),Object.defineProperty(e.prototype,"value",{get:function(){return this.getValue()},enumerable:!0,configurable:!0}),e.prototype._subscribe=function(n){var e=t.prototype._subscribe.call(this,n);return e&&!e.closed&&n.next(this._value),e},e.prototype.getValue=function(){if(this.hasError)throw this.thrownError;if(this.closed)throw new m;return this._value},e.prototype.next=function(n){t.prototype.next.call(this,this._value=n)},e}(x),C=function(t){function e(n,e){var r=t.call(this,n,e)||this;return r.scheduler=n,r.work=e,r.pending=!1,r}return n(e,t),e.prototype.schedule=function(t,n){if(void 0===n&&(n=0),this.closed)return this;this.state=t;var e=this.id,r=this.scheduler;return null!=e&&(this.id=this.recycleAsyncId(r,e,n)),this.pending=!0,this.delay=n,this.id=this.id||this.requestAsyncId(r,this.id,n),this},e.prototype.requestAsyncId=function(t,n,e){return void 0===e&&(e=0),setInterval(t.flush.bind(t,this),e)},e.prototype.recycleAsyncId=function(t,n,e){if(void 0===e&&(e=0),null!==e&&this.delay===e&&!1===this.pending)return n;clearInterval(n)},e.prototype.execute=function(t,n){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;var e=this._execute(t,n);if(e)return e;!1===this.pending&&null!=this.id&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))},e.prototype._execute=function(t,n){var e=!1,r=void 0;try{this.work(t)}catch(t){e=!0,r=!!t&&t||new Error(t)}if(e)return this.unsubscribe(),r},e.prototype._unsubscribe=function(){var t=this.id,n=this.scheduler,e=n.actions,r=e.indexOf(this);this.work=null,this.state=null,this.pending=!1,this.scheduler=null,-1!==r&&e.splice(r,1),null!=t&&(this.id=this.recycleAsyncId(n,t,null)),this.delay=null},e}(function(t){function e(n,e){return t.call(this)||this}return n(e,t),e.prototype.schedule=function(t,n){return this},e}(a)),k=function(){function t(n,e){void 0===e&&(e=t.now),this.SchedulerAction=n,this.now=e}return t.prototype.schedule=function(t,n,e){return void 0===n&&(n=0),new this.SchedulerAction(this,t).schedule(e,n)},t.now=function(){return Date.now()},t}(),V=function(t){function e(n,r){void 0===r&&(r=k.now);var i=t.call(this,n,(function(){return e.delegate&&e.delegate!==i?e.delegate.now():r()}))||this;return i.actions=[],i.active=!1,i.scheduled=void 0,i}return n(e,t),e.prototype.schedule=function(n,r,i){return void 0===r&&(r=0),e.delegate&&e.delegate!==this?e.delegate.schedule(n,r,i):t.prototype.schedule.call(this,n,r,i)},e.prototype.flush=function(t){var n=this.actions;if(this.active)n.push(t);else{var e;this.active=!0;do{if(e=t.execute(t.state,t.delay))break}while(t=n.shift());if(this.active=!1,e){for(;t=n.shift();)t.unsubscribe();throw e}}},e}(k),D=new _((function(t){return t.complete()}));function Y(t){return t?function(t){return new _((function(n){return t.schedule((function(){return n.complete()}))}))}(t):D}function F(t){return t&&"function"==typeof t.schedule}var H=function(t){return function(n){for(var e=0,r=t.length;e<r&&!n.closed;e++)n.next(t[e]);n.complete()}};function M(t,n){return new _((function(e){var r=new a,i=0;return r.add(n.schedule((function(){i!==t.length?(e.next(t[i++]),e.closed||r.add(this.schedule())):e.complete()}))),r}))}function L(t,n){return n?M(t,n):new _(H(t))}function U(t){var n=t.error;t.subscriber.error(n)}var q=function(){function t(t,n,e){this.kind=t,this.value=n,this.error=e,this.hasValue="N"===t}return t.prototype.observe=function(t){switch(this.kind){case"N":return t.next&&t.next(this.value);case"E":return t.error&&t.error(this.error);case"C":return t.complete&&t.complete()}},t.prototype.do=function(t,n,e){switch(this.kind){case"N":return t&&t(this.value);case"E":return n&&n(this.error);case"C":return e&&e()}},t.prototype.accept=function(t,n,e){return t&&"function"==typeof t.next?this.observe(t):this.do(t,n,e)},t.prototype.toObservable=function(){var t,n;switch(this.kind){case"N":return function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var e=t[t.length-1];return F(e)?(t.pop(),M(t,e)):L(t)}(this.value);case"E":return t=this.error,new _(n?function(e){return n.schedule(U,0,{error:t,subscriber:e})}:function(n){return n.error(t)});case"C":return Y()}throw new Error("unexpected notification kind value")},t.createNext=function(n){return void 0!==n?new t("N",n):t.undefinedValueNotification},t.createError=function(n){return new t("E",void 0,n)},t.createComplete=function(){return t.completeNotification},t.completeNotification=new t("C"),t.undefinedValueNotification=new t("N",void 0),t}();function R(t,n){return void 0===n&&(n=0),function(e){return e.lift(new z(t,n))}}var z=function(){function t(t,n){void 0===n&&(n=0),this.scheduler=t,this.delay=n}return t.prototype.call=function(t,n){return n.subscribe(new B(t,this.scheduler,this.delay))},t}(),B=function(t){function e(n,e,r){void 0===r&&(r=0);var i=t.call(this,n)||this;return i.scheduler=e,i.delay=r,i}return n(e,t),e.dispatch=function(t){var n=t.notification,e=t.destination;n.observe(e),this.unsubscribe()},e.prototype.scheduleMessage=function(t){this.destination.add(this.scheduler.schedule(e.dispatch,this.delay,new G(t,this.destination)))},e.prototype._next=function(t){this.scheduleMessage(q.createNext(t))},e.prototype._error=function(t){this.scheduleMessage(q.createError(t)),this.unsubscribe()},e.prototype._complete=function(){this.scheduleMessage(q.createComplete()),this.unsubscribe()},e}(p),G=function(){return function(t,n){this.notification=t,this.destination=n}}(),J=function(t){function e(n,e){var r=t.call(this,n,e)||this;return r.scheduler=n,r.work=e,r}return n(e,t),e.prototype.requestAsyncId=function(n,e,r){return void 0===r&&(r=0),null!==r&&r>0?t.prototype.requestAsyncId.call(this,n,e,r):(n.actions.push(this),n.scheduled||(n.scheduled=requestAnimationFrame((function(){return n.flush(null)}))))},e.prototype.recycleAsyncId=function(n,e,r){if(void 0===r&&(r=0),null!==r&&r>0||null===r&&this.delay>0)return t.prototype.recycleAsyncId.call(this,n,e,r);0===n.actions.length&&(cancelAnimationFrame(e),n.scheduled=void 0)},e}(C),K=new(function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.prototype.flush=function(t){this.active=!0,this.scheduled=void 0;var n,e=this.actions,r=-1,i=e.length;t=t||e.shift();do{if(n=t.execute(t.state,t.delay))break}while(++r<i&&(t=e.shift()));if(this.active=!1,n){for(;++r<i&&(t=e.shift());)t.unsubscribe();throw n}},e}(V))(J);function Q(){}function W(t,n){return function(e){if("function"!=typeof t)throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");return e.lift(new X(t,n))}}var X=function(){function t(t,n){this.project=t,this.thisArg=n}return t.prototype.call=function(t,n){return n.subscribe(new Z(t,this.project,this.thisArg))},t}(),Z=function(t){function e(n,e,r){var i=t.call(this,n)||this;return i.project=e,i.count=0,i.thisArg=r||i,i}return n(e,t),e.prototype._next=function(t){var n;try{n=this.project.call(this.thisArg,t,this.count++)}catch(t){return void this.destination.error(t)}this.destination.next(n)},e}(p),$=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.prototype.notifyNext=function(t,n,e,r,i){this.destination.next(n)},e.prototype.notifyError=function(t,n){this.destination.error(t)},e.prototype.notifyComplete=function(t){this.destination.complete()},e}(p),tt=function(t){function e(n,e,r){var i=t.call(this)||this;return i.parent=n,i.outerValue=e,i.outerIndex=r,i.index=0,i}return n(e,t),e.prototype._next=function(t){this.parent.notifyNext(this.outerValue,t,this.outerIndex,this.index++,this)},e.prototype._error=function(t){this.parent.notifyError(t,this),this.unsubscribe()},e.prototype._complete=function(){this.parent.notifyComplete(this),this.unsubscribe()},e}(p);function nt(){return"function"==typeof Symbol&&Symbol.iterator?Symbol.iterator:"@@iterator"}var et=nt(),rt=function(t){return t&&"number"==typeof t.length&&"function"!=typeof t};function it(t){return!!t&&"function"!=typeof t.subscribe&&"function"==typeof t.then}var ot=function(t){if(t&&"function"==typeof t[b])return r=t,function(t){var n=r[b]();if("function"!=typeof n.subscribe)throw new TypeError("Provided object does not correctly implement Symbol.observable");return n.subscribe(t)};if(rt(t))return H(t);if(it(t))return e=t,function(t){return e.then((function(n){t.closed||(t.next(n),t.complete())}),(function(n){return t.error(n)})).then(null,o),t};if(t&&"function"==typeof t[et])return n=t,function(t){for(var e=n[et]();;){var r=void 0;try{r=e.next()}catch(n){return t.error(n),t}if(r.done){t.complete();break}if(t.next(r.value),t.closed)break}return"function"==typeof e.return&&t.add((function(){e.return&&e.return()})),t};var n,e,r,i=c(t)?"an invalid object":"'"+t+"'";throw new TypeError("You provided "+i+" where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.")};function st(t,n,e,r,i){if(void 0===i&&(i=new tt(t,e,r)),!i.closed)return n instanceof _?n.subscribe(i):ot(n)(i)}function ut(t,n){if(null!=t){if(function(t){return t&&"function"==typeof t[b]}(t))return function(t,n){return new _((function(e){var r=new a;return r.add(n.schedule((function(){var i=t[b]();r.add(i.subscribe({next:function(t){r.add(n.schedule((function(){return e.next(t)})))},error:function(t){r.add(n.schedule((function(){return e.error(t)})))},complete:function(){r.add(n.schedule((function(){return e.complete()})))}}))}))),r}))}(t,n);if(it(t))return function(t,n){return new _((function(e){var r=new a;return r.add(n.schedule((function(){return t.then((function(t){r.add(n.schedule((function(){e.next(t),r.add(n.schedule((function(){return e.complete()})))})))}),(function(t){r.add(n.schedule((function(){return e.error(t)})))}))}))),r}))}(t,n);if(rt(t))return M(t,n);if(function(t){return t&&"function"==typeof t[et]}(t)||"string"==typeof t)return function(t,n){if(!t)throw new Error("Iterable cannot be null");return new _((function(e){var r,i=new a;return i.add((function(){r&&"function"==typeof r.return&&r.return()})),i.add(n.schedule((function(){r=t[et](),i.add(n.schedule((function(){if(!e.closed){var t,n;try{var i=r.next();t=i.value,n=i.done}catch(t){return void e.error(t)}n?e.complete():(e.next(t),this.schedule())}})))}))),i}))}(t,n)}throw new TypeError((null!==t&&typeof t||t)+" is not observable")}function ct(t,n){return n?ut(t,n):t instanceof _?t:new _(ot(t))}var ht=function(t){function e(n){var e=t.call(this)||this;return e.parent=n,e}return n(e,t),e.prototype._next=function(t){this.parent.notifyNext(t)},e.prototype._error=function(t){this.parent.notifyError(t),this.unsubscribe()},e.prototype._complete=function(){this.parent.notifyComplete(),this.unsubscribe()},e}(p),at=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.prototype.notifyNext=function(t){this.destination.next(t)},e.prototype.notifyError=function(t){this.destination.error(t)},e.prototype.notifyComplete=function(){this.destination.complete()},e}(p);function ft(t,n){if(!n.closed)return t instanceof _?t.subscribe(n):ot(t)(n)}function lt(t,n,e){return void 0===e&&(e=Number.POSITIVE_INFINITY),"function"==typeof n?function(r){return r.pipe(lt((function(e,r){return ct(t(e,r)).pipe(W((function(t,i){return n(e,t,r,i)})))}),e))}:("number"==typeof n&&(e=n),function(n){return n.lift(new pt(t,e))})}var pt=function(){function t(t,n){void 0===n&&(n=Number.POSITIVE_INFINITY),this.project=t,this.concurrent=n}return t.prototype.call=function(t,n){return n.subscribe(new dt(t,this.project,this.concurrent))},t}(),dt=function(t){function e(n,e,r){void 0===r&&(r=Number.POSITIVE_INFINITY);var i=t.call(this,n)||this;return i.project=e,i.concurrent=r,i.hasCompleted=!1,i.buffer=[],i.active=0,i.index=0,i}return n(e,t),e.prototype._next=function(t){this.active<this.concurrent?this._tryNext(t):this.buffer.push(t)},e.prototype._tryNext=function(t){var n,e=this.index++;try{n=this.project(t,e)}catch(t){return void this.destination.error(t)}this.active++,this._innerSub(n)},e.prototype._innerSub=function(t){var n=new ht(this),e=this.destination;e.add(n);var r=ft(t,n);r!==n&&e.add(r)},e.prototype._complete=function(){this.hasCompleted=!0,0===this.active&&0===this.buffer.length&&this.destination.complete(),this.unsubscribe()},e.prototype.notifyNext=function(t){this.destination.next(t)},e.prototype.notifyComplete=function(){var t=this.buffer;this.active--,t.length>0?this._next(t.shift()):0===this.active&&this.hasCompleted&&this.destination.complete()},e}(at);function bt(t){return void 0===t&&(t=Number.POSITIVE_INFINITY),lt(y,t)}function yt(t,n,r,i){return e(r)&&(i=r,r=void 0),i?yt(t,n,r).pipe(W((function(t){return u(t)?i.apply(void 0,t):i(t)}))):new _((function(e){vt(t,n,(function(t){arguments.length>1?e.next(Array.prototype.slice.call(arguments)):e.next(t)}),e,r)}))}function vt(t,n,e,r,i){var o;if(function(t){return t&&"function"==typeof t.addEventListener&&"function"==typeof t.removeEventListener}(t)){var s=t;t.addEventListener(n,e,i),o=function(){return s.removeEventListener(n,e,i)}}else if(function(t){return t&&"function"==typeof t.on&&"function"==typeof t.off}(t)){var u=t;t.on(n,e),o=function(){return u.off(n,e)}}else if(function(t){return t&&"function"==typeof t.addListener&&"function"==typeof t.removeListener}(t)){var c=t;t.addListener(n,e),o=function(){return c.removeListener(n,e)}}else{if(!t||!t.length)throw new TypeError("Invalid event target");for(var h=0,a=t.length;h<a;h++)vt(t[h],n,e,r,i)}r.add(o)}function _t(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var e=Number.POSITIVE_INFINITY,r=null,i=t[t.length-1];return F(i)?(r=t.pop(),t.length>1&&"number"==typeof t[t.length-1]&&(e=t.pop())):"number"==typeof i&&(e=t.pop()),null===r&&1===t.length&&t[0]instanceof _?t[0]:bt(e)(L(t,r))}var wt=new _(Q);function mt(t,n){return function(e){return e.lift(new gt(t,n))}}var gt=function(){function t(t,n){this.predicate=t,this.thisArg=n}return t.prototype.call=function(t,n){return n.subscribe(new Et(t,this.predicate,this.thisArg))},t}(),Et=function(t){function e(n,e,r){var i=t.call(this,n)||this;return i.predicate=e,i.thisArg=r,i.count=0,i}return n(e,t),e.prototype._next=function(t){var n;try{n=this.predicate.call(this.thisArg,t,this.count++)}catch(t){return void this.destination.error(t)}n&&this.destination.next(t)},e}(p);function xt(t,n){return lt(t,n,1)}var St=function(){function t(t,n){this.subjectFactory=t,this.selector=n}return t.prototype.call=function(t,n){var e=this.selector,r=this.subjectFactory(),i=e(r).subscribe(t);return i.add(n.subscribe(r)),i},t}();function jt(){return new x}function It(){return function(t){return j()((n=jt,function(t){var r;if(r="function"==typeof n?n:function(){return n},"function"==typeof e)return t.lift(new St(r,e));var i=Object.create(t,N);return i.source=t,i.subjectFactory=r,i})(t));var n,e}}function Tt(t,n){return"function"==typeof n?function(e){return e.pipe(Tt((function(e,r){return ct(t(e,r)).pipe(W((function(t,i){return n(e,t,r,i)})))})))}:function(n){return n.lift(new Ot(t))}}var Ot=function(){function t(t){this.project=t}return t.prototype.call=function(t,n){return n.subscribe(new Nt(t,this.project))},t}(),Nt=function(t){function e(n,e){var r=t.call(this,n)||this;return r.project=e,r.index=0,r}return n(e,t),e.prototype._next=function(t){var n,e=this.index++;try{n=this.project(t,e)}catch(t){return void this.destination.error(t)}this._innerSub(n)},e.prototype._innerSub=function(t){var n=this.innerSubscription;n&&n.unsubscribe();var e=new ht(this),r=this.destination;r.add(e),this.innerSubscription=ft(t,e),this.innerSubscription!==e&&r.add(this.innerSubscription)},e.prototype._complete=function(){var n=this.innerSubscription;n&&!n.closed||t.prototype._complete.call(this),this.unsubscribe()},e.prototype._unsubscribe=function(){this.innerSubscription=void 0},e.prototype.notifyComplete=function(){this.innerSubscription=void 0,this.isStopped&&t.prototype._complete.call(this)},e.prototype.notifyNext=function(t){this.destination.next(t)},e}(at);function Pt(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return function(n){var e;"function"==typeof t[t.length-1]&&(e=t.pop());var r=t;return n.lift(new At(r,e))}}var At=function(){function t(t,n){this.observables=t,this.project=n}return t.prototype.call=function(t,n){return n.subscribe(new Ct(t,this.observables,this.project))},t}(),Ct=function(t){function e(n,e,r){var i=t.call(this,n)||this;i.observables=e,i.project=r,i.toRespond=[];var o=e.length;i.values=new Array(o);for(var s=0;s<o;s++)i.toRespond.push(s);for(s=0;s<o;s++){var u=e[s];i.add(st(i,u,void 0,s))}return i}return n(e,t),e.prototype.notifyNext=function(t,n,e){this.values[e]=n;var r=this.toRespond;if(r.length>0){var i=r.indexOf(e);-1!==i&&r.splice(i,1)}},e.prototype.notifyComplete=function(){},e.prototype._next=function(t){if(0===this.toRespond.length){var n=[t].concat(this.values);this.project?this._tryProject(n):this.destination.next(n)}},e.prototype._tryProject=function(t){var n;try{n=this.project.apply(this,t)}catch(t){return void this.destination.error(t)}this.destination.next(n)},e}($);export{A as B,wt as N,mt as a,ct as b,Tt as c,_t as d,xt as e,yt as f,K as g,W as m,R as o,It as s,Pt as w};
//# sourceMappingURL=rxjs.es.js.map
