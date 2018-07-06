import $ from 'jquery';
import {Move} from './Move';


// moveEnd
//  $('.margin-border').find('ul').on('moveEnd', function (e, param) {
//      console.log('moveend' + " - event fired on page: " + param  + "!")
//      moveFullPage.moveTo(param);
//  })

// vanilla js event dispatch
document.querySelector('.margin-border ul').addEventListener('moveEnd', function (e) {
    console.log('moveend' + " - event fired on page: " + e.detail + "!")
    moveFullPage.moveTo(e.detail);
})

var moveFullPage = Move({
    ul : $('.full-page').find('ul'),
    infiniteScroll : false,
    touchDrag : false
});

var moveMarginBorder = Move({
    ul: $('.margin-border').find('ul'),
    infiniteScroll: true,
    touchDrag : true
});


// moveLeft
document.querySelector(".prev").addEventListener('click', function () {

    moveMarginBorder.moveLeft();
})

// moveRight
document.querySelector(".next").addEventListener('click', function () {

    moveMarginBorder.moveRight();
})

//moveTo
 window.addEventListener('keyup', function (e) {
    moveMarginBorder.moveTo(Number(e.key));
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
       moveFullPage.reCalculate();
       moveMarginBorder.reCalculate();
    }
}());


