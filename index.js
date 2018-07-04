import $ from 'jquery';
import {Move} from './Move.js';


$(window).resize(function () {
    console.log("recalculate")
    moveFullPage.reCalculate();
    moveMarginBorder.reCalculate();
    
 })

// moveEnd 
 $('.margin-border').find('ul').on('moveEnd', function (e, param) {
     console.log('moveend' + " - event fired on page: " + param  + "!")
     moveFullPage.moveTo(param);
 })


var moveFullPage = Move({
    parent : $('.full-page').find('ul'),
    infiniteScroll : false
});

var moveMarginBorder = Move({
    parent: $('.margin-border').find('ul'),
    infiniteScroll: true
});


// moveLeft
$(".prev").on('click', function () {

    moveMarginBorder.moveLeft();
})

// moveRight
$(".next").on('click', function () {

    moveMarginBorder.moveRight();
})

//moveTo
$(window).on('keyup', function (e) {
    moveMarginBorder.moveTo(Number(e.key)); 
})


