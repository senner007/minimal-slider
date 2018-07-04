import $ from 'jquery';
import {Move} from './Move.js';

$(window).resize(function () {
    console.log("recalculate")
    moveFullPage.reCalculate();
    moveMarginBorder.reCalculate();
 })


var moveFullPage = Move({
    parent : $('.full-page').find('ul'),
  //  infiniteScroll : true,
    speed: "0.8s"
});

var moveMarginBorder = Move({
    parent: $('.margin-border').find('ul'),
    infiniteScroll: true,
    speed: "0.4s"
});


$("#buttonContainer button:nth-child(1)").on('click', function () {
    moveFullPage.moveLeft();
    moveMarginBorder.moveLeft();
})

$("#buttonContainer button:nth-child(2)").on('click', function () {
    moveFullPage.moveRight();
    moveMarginBorder.moveRight();
})

$(window).on('keyup', function (e) {
    moveFullPage.moveTo(Number(e.key)); 
    moveMarginBorder.moveTo(Number(e.key)); 
})


