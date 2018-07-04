import $ from 'jquery';
import {Move} from './Move.js';

$(window).resize(function () {
    console.log("recalculate")
        move.reCalculate();
 })


var move = Move({
    parent : $('ul'),
    infiniteScroll : true,
    speed: "0.5s"
});


$("#buttonContainer button:nth-child(1)").on('click', function () {
    move.moveLeft();
})

$("#buttonContainer button:nth-child(2)").on('click', function () {
    move.moveRight();
})

$(window).on('keyup', function (e) {
    move.moveTo(Number(e.key)); 
})


