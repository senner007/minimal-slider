import $ from 'jquery';
import {
    Slider
} from './src/slider';

import './css.css';

var isTouch = (function is_touch_device() {
    return (('ontouchstart' in window) ||
        (navigator.MaxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
})();

var isPointer = (window.PointerEvent);
var eClick = isTouch ? 'touchstart' : isPointer ? 'pointerdown' : 'click'
// moveEnd
//  $('.margin-border').find('ul').on('moveEnd', function (e, param) {
//      console.log('moveend' + " - event fired on page: " + param  + "!")
//      sliderFullPage.moveTo(param);
//  })

// vanilla js event listener
document.querySelector('.margin-border ul').addEventListener('moveEnd', function (e) {
    console.log('moveend' + " - event fired on page: " + e.detail + "!")
    sliderFullPage.moveTo(e.detail);
})

var sliderFullPage = Slider({
    ul: document.querySelector('.full-page ul'),
    infiniteScroll: false,
    touchDrag: true
});

var sliderMarginBorder = Slider({
    ul: document.querySelector('.margin-border ul'),
    infiniteScroll: true,
    touchDrag: true
});

// add elem at position
sliderMarginBorder.add("Pink Panther", 0);
// remove at position
sliderMarginBorder.remove(1);

// moveLeft
document.querySelector(".prev").addEventListener(eClick, function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.pointerType === 'mouse' && e.which != 1) return;
    sliderMarginBorder.moveLeft();
})

// moveRight
document.querySelector(".next").addEventListener(eClick, function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.pointerType === 'mouse' && e.which != 1) return;
    sliderMarginBorder.moveRight();
})


// mousewheel event
if ( eClick === 'click' || eClick === 'pointerdown') {
    document.querySelector('.margin-border').addEventListener("wheel", function (e) {
        e.preventDefault();
        e.stopPropagation();
        document.body.style.overflowY = "hidden";
        if (e.deltaY < 0) sliderMarginBorder.moveLeft()
        else {  sliderMarginBorder.moveRight() }
        document.body.style.overflowY = "scroll";
    }, {
        // capture: true,
        // passive: true
      });
}

//moveTo
window.addEventListener('keyup', function (e) {
    sliderMarginBorder.moveTo(Number(e.key));
});

// resize throttle
(function () {
    window.addEventListener("resize", resizeThrottler, false);
    var resizeTimeout;

    function resizeThrottler() {
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(function () {
                resizeTimeout = null;
                actualResizeHandler();

                // The actualResizeHandler will execute at a rate of 15fps
            }, 66);
        }
    }

    function actualResizeHandler() {
        console.log("recalculate")
        sliderFullPage.reCalculate();
        sliderMarginBorder.reCalculate();
    }
}());