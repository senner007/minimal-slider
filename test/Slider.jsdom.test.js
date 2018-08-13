'use strict';
import {
    Slider
} from '../src/Slider';
import $ from 'jquery';

function createDOM(width = '400px', marginLeft = '0px', marginRight = '0px') {

    return `<div id="container">    
                <div style="width: ${width};" class="test-full-page"> 
                    <ul>
                        <li style="width: 400px; position: absolute; margin-left: ${marginLeft}; margin-right: ${marginRight};">Page 1</li>
                        <li style="width: 400px; position: absolute; margin-left: ${marginLeft}; margin-right: ${marginRight};">Page 2</li>
                        <li style="width: 400px; position: absolute; margin-left: ${marginLeft}; margin-right: ${marginRight};">Page 3</li>
                        <li style="width: 400px; position: absolute; margin-left: ${marginLeft}; margin-right: ${marginRight};">Page 4</li>
                        <li style="width: 400px; position: absolute; margin-left: ${marginLeft}; margin-right: ${marginRight};">Page 5</li>
                    </ul>
                </div>
            </div>`;
}

const setSlider = () => Slider({
    ul: $('.test-full-page').find('ul'),
    infiniteScroll: true,
    touchDrag: true
});


test('getState should return 1 on init', () => {

    // Set up our document body
    document.body.innerHTML = createDOM();
    var testFullPage = setSlider();

    expect(testFullPage.getState()).toEqual(1);
});

test('lis should align correctly, no margin', () => {

    // Set up our document body
    document.body.innerHTML = createDOM();
    var testFullPage = setSlider();

    // expect(window.getComputedStyle($('ul').children()[0])['width']).toEqual('400px');
    // expect($('li')[0].style.width).toEqual('400px');
    expect($('li').outerWidth(true)).toEqual(400);

    expect($('.test-full-page').find('li').eq(0).css('left')).toEqual('-800px');
    expect($('.test-full-page').find('li').eq(2).css('left')).toEqual('0px');
    expect($('.test-full-page').find('li').eq(8).css('left')).toEqual('2400px');
});

test('lis should align correctly, left margin', () => {

    // Set up our document body
    document.body.innerHTML = createDOM('410px', '10px');
    var testFullPage = setSlider();

    // expect(window.getComputedStyle($('ul').children()[0])['width']).toEqual('400px');
    // expect($('li')[0].style.width).toEqual('400px');
    expect($('li').outerWidth(true)).toEqual(410);

    expect($('.test-full-page').find('li').eq(0).css('left')).toEqual('-820px');
    expect($('.test-full-page').find('li').eq(2).css('left')).toEqual('0px');
    expect($('.test-full-page').find('li').eq(8).css('left')).toEqual('2460px');
});

test('lis should align correctly, left margin, right margin', () => {

    // Set up our document body
    document.body.innerHTML = createDOM('410px', '5px', '5px');
    var testFullPage = setSlider();

    // expect(window.getComputedStyle($('ul').children()[0])['width']).toEqual('400px');
    // expect($('li')[0].style.width).toEqual('400px');
    expect($('li').outerWidth(true)).toEqual(410);

    expect($('.test-full-page').find('li').eq(0).css('left')).toEqual('-820px');
    expect($('.test-full-page').find('li').eq(2).css('left')).toEqual('0px');
    expect($('.test-full-page').find('li').eq(8).css('left')).toEqual('2460px');
});

test('should jump to 5 from 1 when infiniteScroll', async () => {

    document.body.innerHTML = createDOM();
    var testFullPage = setSlider();

    testFullPage.moveLeft();
    expect(testFullPage.getState()).toEqual(5);
    // wait for move callback
    await new Promise(resolve => setTimeout(resolve, 30));
    expect(testFullPage._getTransformState()).toEqual(-1600);

});

test('should jump to 1 from 5 when infiniteScroll', async () => {

    document.body.innerHTML = createDOM();
    var testFullPage = setSlider();

    testFullPage.moveTo(5);
    testFullPage.moveRight();
    expect(testFullPage.getState()).toEqual(1);
    // wait for moveMe callback
    await new Promise(resolve => setTimeout(resolve, 30));
    expect(testFullPage._getTransformState()).toEqual(0);

});