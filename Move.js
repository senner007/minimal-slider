import $ from 'jquery';
import './css.css';

export const Move = function (o) {

    var state = 1;
    var list = o.ul;
    var infiniteScroll = o.infiniteScroll;
    var lis = list.children();
    var listJs = list[0]; // vanilla js object
    var listLiJs = lis[0]; // vanilla js object
    var speed = listJs.style.transitionDuration;
    var isDormant = true; // only fire 1 moveEnd event after multiple repeated move calls
    var elems = lis.length;
    var transitionState = 0;
    var marginBorder = parseInt(lis.outerWidth(true) - lis.width());
    var orig;
    var liOuter;

    function moveHome() {
        listJs.style.transform = "translateX(" + 0 + "px)";
        transitionState = 0;
    }

    function moveMe(distance, setSpeed, callback) {
        distance = Math.round(distance);

        if (isDormant) {
            isDormant = false;
            listJs.addEventListener('transitionend', function moveend() {
                isDormant = true;
                listJs.removeEventListener('transitionend', moveend);

                listJs.dispatchEvent(new CustomEvent('moveEnd', {
                    detail: state
                }));
                // $ trigger moveEnd event
                // list.trigger('moveEnd', [state]);
            })
        }
        listJs.style.transitionDuration = setSpeed;
        listJs.style.transform = "translateX(" + (transitionState + distance) + "px)";
        transitionState += distance;

        if (!callback) return;
        setTimeout(function () {
            listJs.style.transitionDuration = speed;
            callback();
        }, 0)
    }

    function setStyle() {

        var ulParentwidth = Math.round(list.parent().outerWidth(true));

        if (!orig) {
            // style retrieves css unit value
            listLiJs.style.display = 'none';
            orig = window.getComputedStyle(listLiJs)['width'];
            listLiJs.style.display = 'block';
        }

        // scale according to width percentage if ulParentwidth is above 2 times the width of the li min-width
        if (orig.indexOf('%') != -1 && ulParentwidth / 2 > parseInt(lis.css('min-width'))) {
            liOuter = orig.replace('%', '') / 100 * ulParentwidth
        } else {
            liOuter = parseInt(lis.outerWidth(true));
        }

        list.find('.clone').remove();
        lis.each(function (index, li) {
            $(li).css({
                'width': liOuter - marginBorder + 'px',
                'left': (liOuter) * index + (ulParentwidth / 2 - (liOuter / 2)) + 'px',
            })

        });

        if (infiniteScroll) {

            var first = lis.eq(0).clone();
            var second = lis.eq(1).clone();
            var last = lis.eq(elems - 1).clone();
            var nextLast = lis.eq(elems - 2).clone();

            list.prepend(last.css('left', ulParentwidth / 2 - liOuter / 2 - liOuter + "px").addClass('clone'))
                .prepend(nextLast.css('left', ulParentwidth / 2 - liOuter / 2 - (liOuter * 2) + "px").addClass('clone'))

                .append(first.css('left', (liOuter) * elems + (ulParentwidth / 2 - (liOuter / 2)) + "px").addClass('clone'))
                .append(second.css('left', (liOuter) * (elems + 1) + (ulParentwidth / 2 - (liOuter / 2)) + "px").addClass('clone'));

        }

    }
    setStyle();

    // touch drag
    (function () {
        if (!o.touchDrag) return;
        var isTouch = (function is_touch_device() {
            return (('ontouchstart' in window) ||
                (navigator.MaxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
        })();

        var isPointer = (window.PointerEvent);

        var eStart = isTouch ? 'touchstart' : isPointer ? 'pointerdown' : 'mousedown'
        var eMove = isTouch ? 'touchmove' : isPointer ? 'pointermove' : 'mousemove'
        var eEnd = isTouch ? 'touchend' : isPointer ? 'pointerup' : 'mouseup'
        var lastPageX;
        var startTransition;
        list.parent().on(eStart, function (e) {
            e.preventDefault();

            listJs.style.transitionDuration = "0.0s";

            startTransition = transitionState;
            lastPageX = e.pageX;

            function mm(e) {
                e.preventDefault();
                var diff = parseInt(lastPageX - e.pageX);

                if (Number.isInteger(diff) && diff != 0) {
                    moveMe(-diff);
                    lastPageX = e.pageX;
                }
            } -

            $(window).on(eMove, mm);

            $(window).on(eEnd, function mu() {

                $(window).off(eEnd, mu)
                $(window).off(eMove, mm)
                listJs.style.transitionDuration = speed;
                var diff = Math.abs(transitionState - startTransition);
                if (diff == 0) return;

                if (diff > liOuter / 2 && transitionState > startTransition) {

                    if (state === 1 && infiniteScroll) {
                        state = elems;
                        moveMe((-liOuter * elems), "0s", function () {
                            moveMe(liOuter - diff, speed)
                        });
                    } else {

                        state--;
                        moveMe(liOuter - diff, speed)
                    }

                } else if (diff > liOuter / 2 && transitionState < startTransition) {

                    if (state === 5 && infiniteScroll) {
                        moveMe((liOuter * elems), "0s", function () {
                            moveMe(diff - liOuter)
                            state = 1;
                        });
                    } else {
                        moveMe(diff - liOuter, speed)
                        state++;
                    }

                } else {
                    var back = transitionState > startTransition ? -diff : diff
                    moveMe(back, speed)
                }
            })
        })
    })();

    return {
        moveRight: function () {
            if (state === elems && infiniteScroll) {
                moveMe(liOuter * elems, "0s", function () {
                    state = 1;
                    moveMe(-liOuter, speed);
                });
                return;
            } else if (state > elems - 1) return
            else {
                moveMe(-liOuter)
                state++;
            }
        },
        moveLeft: function () {
            if (state === 1 && infiniteScroll) {
                moveMe(-liOuter * elems, "0s", function () {
                    state = elems;
                    moveMe(liOuter, speed);
                });
                return;
            } else if (state === 1) return
            else {
                moveMe(liOuter);
                state--;
            }
        },
        getState: function () {
            console.log(state)
            return state;
        },
        moveTo: function (num) {
            if (num < 1 || num > elems || !Number.isInteger(num)) return;
            moveMe(liOuter * (state - num))
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