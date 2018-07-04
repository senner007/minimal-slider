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
$("#buttonContainer button:nth-child(1)").on('click', function () {
    moveFullPage.moveLeft();
    moveMarginBorder.moveLeft();
})

// moveRight
$("#buttonContainer button:nth-child(2)").on('click', function () {
    moveFullPage.moveRight();
    moveMarginBorder.moveRight();
})

//moveTo
$(window).on('keyup', function (e) {
    moveFullPage.moveTo(Number(e.key)); 
    moveMarginBorder.moveTo(Number(e.key)); 
})


