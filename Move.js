import $ from 'jquery';

export const Move = function (o) {
    var state = 1;
    var list = o.parent;
    var infiniteScroll = o.infiniteScroll;
    var listJs = list[0]; // vanilla js object
    var speed = listJs.style.transitionDuration;
    var isDorment = true; // only fire 1 moveEnd event after multiple repeated move calls 
    var width = Math.round(list.parent().width());
    var elems = list.children().length;
    var transitionState = 0;
    var lis = list.children();
    var marginBorder = (parseInt(lis.css('margin-left')) +
        parseInt(lis.css('margin-right')) +
        parseInt(lis.css('border-left-width')) +
        parseInt(lis.css('border-right-width')));

    function scrollJump(width, callback) {
        listJs.style.transitionDuration = "0.0s";
        listJs.style.transform = "translateX(" + width + "px)";
        transitionState = width;

        setTimeout(function () {
            listJs.style.transitionDuration = speed;
            callback();
        }, 0)
    }

    function moveHome() {

        listJs.style.transform = "translateX(" + 0 + "px)";
        transitionState = 0;
    }

    function moveMe(distance) {
       if (isDorment) {
            isDorment = false;
              listJs.addEventListener('transitionend', function moveend() {
                  isDorment = true;
                  listJs.removeEventListener('transitionend', moveend);
                  // $ trigger moveEnd event
                  list.trigger('moveEnd', [state]);
              })
       }
        var dist = Math.round(parseInt(distance))
        listJs.style.transform = "translateX(" + (transitionState + dist) + "px)";
        transitionState += dist;
    }

    function setStyle() {

        width = Math.round(list.parent().width());

        list.find('.clone').remove();
        list.css('width', width * elems + 'px').children().each(function (index, li) {
            $(li).css({
                'width': width - marginBorder + 'px',
                'left': (width) * index + 'px',
            })
        });

        if (infiniteScroll) {

            var first = lis.eq(0).clone();
            var second = lis.eq(1).clone();
            var last = lis.eq(elems - 1).clone();
            var nextLast = lis.eq(elems - 2).clone();

            list.prepend(last.css('left', -width + "px").addClass('clone'))
                .prepend(nextLast.css('left', -width * 2 + "px").addClass('clone'))
                .append(first.css('left', (width * elems) + "px").addClass('clone'))
                .append(second.css('left', (width * (elems + 1)) + "px").addClass('clone'));

        }

    }
    setStyle(list);

    return {
        moveRight: function () {
            var distance = '-' + width;
            if (state === elems && infiniteScroll) {
                scrollJump(width, function () {
                    state = 1;
                    moveMe(distance);
                });
                return;
            } else if (state > elems - 1) return
            else {
                moveMe(distance)
                state++;
            }
        },
        moveLeft: function () {
            var distance = '+' + width;
            if (state === 1 && infiniteScroll) {
                scrollJump((-width * (elems)), function () {
                    state = elems;
                    moveMe(distance);
                });
                return;
            } else if (state === 1) return
            else {
                moveMe(distance);
                state--;
            }
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
        reCalculate: function () { // throttle me!;
            setStyle();
            this.reset();
        },
        reset: function () {
            moveHome();
            state = 1;

        }

    }

}