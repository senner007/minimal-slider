'use strict';
import {Slider} from '../src/Slider';
import $ from 'jquery';
function createDOM () {

    return '<div id="container">'    +
        '<div style="width: 400px;" class="margin-border">'  +
            '<ul>'+
                '<li style="width: 400px; position: absolute;">Page 1</li>'+
                '<li style="width: 400px; position: absolute;">Page 2</li>'+
                '<li style="width: 400px; position: absolute;">Page 3</li>'+
                '<li style="width: 400px; position: absolute;">Page 4</li>'+
                '<li style="width: 400px; position: absolute;">Page 5</li>'+
            '</ul>'+
        '</div>'+
    '</div>';
}
function setSlider () {
    
    return Slider({
        ul: $('.margin-border').find('ul'),
        infiniteScroll: true,
        touchDrag: true
    });
}

test('getState should return 1 on init', () => {

    // Set up our document body
    document.body.innerHTML = createDOM(); 
    var moveMarginBorder = setSlider();

    expect(moveMarginBorder.getState()).toEqual(1);
});

test('lis should align correctly', () => {

    // Set up our document body
    document.body.innerHTML = createDOM();
    var moveMarginBorder = setSlider();

    expect(window.getComputedStyle($('ul').children()[0])['width']).toEqual('400px');
    expect($('li')[0].style.width).toEqual('400px');

    expect( $('.margin-border').find('li').eq(0).css('left') ).toEqual('-800px');
    expect( $('.margin-border').find('li').eq(2).css('left') ).toEqual('0px');
    expect( $('.margin-border').find('li').eq(8).css('left') ).toEqual('2400px');
});

test('should jump to 5 from 1 when infiniteScroll', async () => {

    document.body.innerHTML = createDOM();
    var moveMarginBorder = setSlider();
 
    moveMarginBorder.moveLeft();
    expect(moveMarginBorder.getState()).toEqual(5);
    // wait for move callback
    await new Promise(resolve => setTimeout(resolve, 30));
    expect(moveMarginBorder._getTransformState()).toEqual(-1600);
    

});

test('should jump to 1 from 5 when infiniteScroll', async () => {

    document.body.innerHTML = createDOM();
    var moveMarginBorder = setSlider();
 
    moveMarginBorder.moveTo(5);
    moveMarginBorder.moveRight();
    expect(moveMarginBorder.getState()).toEqual(1);
    // wait for moveMe callback
    await new Promise(resolve => setTimeout(resolve, 30));
    expect(moveMarginBorder._getTransformState()).toEqual(0);
    

});
