var Slider=function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Slider=void 0;var r=u(n(1)),o=u(n(2)),i=u(n(4));function u(e){return e&&e.__esModule?e:{default:e}}(0,u(n(5)).default)();t.Slider=function(e){var t=1,n=e.ul,u=e.infiniteScroll,a=n[0],l=a.style.transitionDuration,s=n.children().length,c=(0,r.default)(a,l,function(){a.dispatchEvent(new CustomEvent("moveEnd",{detail:t}))}),d=(0,o.default)(n,u);return d.setStyles(),c.jumpMove=function(e){var n=t===(e<0?s:1);return t=n&&u?1===t?s:1:n?void 0:t-e,function(t){var r=function(t){return t*e};n&&u?c.moveMe(-r(d.liOuter*s),"0s",function(){return c.moveMe(r(t))}):c.moveMe(n?-r(d.liOuter-t):r(t))}},e.touchDrag&&(0,i.default)(n,c,d),{_getTransformState:function(){return c.transitionState},moveLeft:function(){c.jumpMove(1)(d.liOuter)},moveRight:function(){c.jumpMove(-1)(d.liOuter)},getState:function(){return console.log(t),t},moveTo:function(e){e<1||e>s||!Number.isInteger(e)||(c.moveMe(d.liOuter*(t-e)),t=e)},reCalculate:function(){d.setStyles(),this.reset()},reset:function(){c.moveMe(-c.transitionState),t=1},add:function(e,t){d.addRemove(t,e,++s)},remove:function(e){d.addRemove(e,!1,--s)}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){var r,o=!0,i=0;return{get transitionState(){return i},moveMe:function(u){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t,l=arguments.length>2?arguments[2]:void 0;0!==u&&(u=Math.round(u),o&&(o=!1,e.addEventListener("transitionend",function t(){o=!0,e.removeEventListener("transitionend",t),n()})),a!=r&&(e.style.transitionDuration=a),e.style.transform="translateX("+(i+u)+"px)",i+=u,r=a,l&&setTimeout(function(){l()},20))}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var n,o=parseInt(e.find("li").css("min-width")),i=e[0].children,u=(0,r.getOrigStyles)(i[0]);return{get liOuter(){return Math.round(n)},setStyles:function(){var a=Math.round(e.parent().outerWidth(!0));n=-1!=u.width.indexOf("%")&&a/2>o?parseInt(u.width.replace("%","")/100*a):parseInt(e.find("li").outerWidth(!0)),function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;Array.from(i).forEach(function(t,r){t.classList.contains("clone")||(t.style.width=n-u.marginBorder+"px",t.style.left=n*e+++(a/2-n/2)+"px")})}(),t&&(Array.from(i).forEach(function(e){e.classList.contains("clone")&&e.parentNode.removeChild(e)}),function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i.length,t=(0,r.cloneCurry)(e,i);t([1,2],n).addClones(),t([e,e-1],-n).prependClones()}())},addRemove:function(n,r){var o=e.children().eq(t?n+2:n);r?o.after(r):o.remove(),this.setStyles()}}};var r=n(3)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.cloneCurry=function(e,t){return function(n,r){return n=n.map(function(n){var o=t[n-1].cloneNode(!0);return o.classList.add("clone"),o.style.left=parseInt(o.style.left)+e*r+"px",o}),{addClones:function(){console.log(n),n.forEach(function(e){return t[0].parentNode.appendChild(e)})},prependClones:function(){n.forEach(function(e){return t[0].parentNode.insertBefore(e,t[0])})}}}},t.getOrigStyles=function(e){e.style.display="none";var t=window.getComputedStyle(e),n=t.width;return e.style.display="block",{width:n,marginBorder:parseInt(t.marginLeft)+parseInt(t.marginRight)+parseInt(t.borderLeftWidth)+parseInt(t.borderRightWidth)}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){var r,o,i="ontouchstart"in window||navigator.MaxTouchPoints>0||navigator.msMaxTouchPoints>0,u=window.PointerEvent,a=i?"touchstart":u?"pointerdown":"mousedown",l=i?"touchmove":u?"pointermove":"mousemove",s=i?"touchend":u?"pointerup":"mouseup";e.parent()[0].addEventListener(a,function(e){function i(e){e.preventDefault();var n=parseInt(r-e.pageX);Number.isInteger(n)&&0!=n&&(t.moveMe(-n,"0s"),r=e.pageX)}e.preventDefault(),o=t.transitionState,r=e.pageX,window.addEventListener(l,i),window.addEventListener(s,function e(){window.removeEventListener(l,i);window.removeEventListener(s,e);var r=Math.abs(t.transitionState-o);if(0==r)return;r>n.liOuter/2?t.jumpMove(t.transitionState>o?1:-1)(n.liOuter-r):t.moveMe(t.transitionState>o?-r:r)})})}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){(function(){if("function"==typeof window.CustomEvent)return!1;function e(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n}e.prototype=window.Event.prototype,window.CustomEvent=e})(),function(e){e.forEach(function(e){e.hasOwnProperty("remove")||Object.defineProperty(e,"remove",{configurable:!0,enumerable:!0,writable:!0,value:function(){null!==this.parentNode&&this.parentNode.removeChild(this)}})})}([Element.prototype,CharacterData.prototype,DocumentType.prototype]),Number.isInteger=Number.isInteger||function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e}}}]);