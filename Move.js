import $ from 'jquery';

export const Move = function (list) {
    var state = 1;
    var listJs = list[0]; // vanilla js object
    var width = reStyle(list);
    var elems = list.children().length;
    var transitionState = 0;

    function moveHome() {

        listJs.style.transform = "translateX(" + 0 + "px)";
        transitionState = 0;
    }

    function moveMe(distance) {

        listJs.style.transform = "translateX(" + (transitionState + parseInt(distance)) + "px)";
        transitionState += parseInt(distance);
    }

    function reStyle() {

        var width = list.parent().width();

        list.css('width', width * list.children().length + 'px').children().each(function (index, li) {
            $(li).css({
                'width': width + 'px',
                'left': width * index + 'px'
            })
        })

        return width;
    }

    return {

        moveRight: function () {
            if (state > elems - 1) return;
            moveMe('-' + width)
            state++;
        },
        moveLeft: function () {
            if (state === 1) return;
            moveMe('+' + width)
            state--;
        },
        getState: function () {
            console.log(state)
            return state;
        },
        moveTo: function (num) {
            if (num < 1 || num > elems || !Number.isInteger(num)) return;
            moveMe(width * (state - num))
            state = num;
        },
        reCalculate: function () {
            width = reStyle()
            this.reset();
        },
        reset: function () {
            state = 1;
            moveHome();
        }

    }

}