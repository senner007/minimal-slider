import $ from 'jquery';
import {
    Mover
} from './mover';
import {
    Styler
} from './styler';
import '../css.css';

export const Move = function (o) {
    var state = 1,
        list = o.ul,
        infiniteScroll = o.infiniteScroll,
        listJs = list[0], // vanilla js object
        speed = listJs.style.transitionDuration, // get css transition duration
        elems = list.children().length; // number of lis

    var mover = Mover(listJs, function () {
        listJs.dispatchEvent(new CustomEvent('moveEnd', {
            detail: state
        }));
    })

    function jumpMove(jumpDistance, jumpPoint, distance) {
        if (state === jumpPoint && infiniteScroll) {
            state = jumpPoint == 1 ? elems : 1
            mover.moveMe(jumpDistance, "0s", function () {
                mover.moveMe(distance, speed);
            });
            return;
        } else if (state === jumpPoint) {
            // bounce back at end points if no infinte scroll
            mover.moveMe(jumpDistance/elems + distance, speed)
        }
        else {
            mover.moveMe(distance, speed)
            // determine direction based on jumpDistance param
            state = jumpDistance > 0 ? state + 1 : state - 1
        }
    }
    var styles = Styler(list, infiniteScroll, elems);
    styles.setStyle();

    
    // touch drag
    (function () {
        if (!o.touchDrag) return;

        // determine touch and pointer support
        var isTouch = (function is_touch_device() {
            return (('ontouchstart' in window) ||
                (navigator.MaxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
        })();
        var isPointer = (window.PointerEvent);

        var eStart = isTouch ? 'touchstart' : isPointer ? 'pointerdown' : 'mousedown'
        var eMove = isTouch ? 'touchmove' : isPointer ? 'pointermove' : 'mousemove'
        var eEnd = isTouch ? 'touchend' : isPointer ? 'pointerup' : 'mouseup'
        
        var lastPageX,
            startTransition;

        list.parent().on(eStart, function (e) {
            e.preventDefault();
            startTransition = mover.transitionState;
            lastPageX = e.pageX;
            $(window).on(eMove, onmove).on(eEnd, onup);

            function onmove(e) {
                e.preventDefault();
                var newDistance = parseInt(lastPageX - e.pageX);

                if (Number.isInteger(newDistance) && newDistance != 0) {
                    mover.moveMe(-newDistance, "0s");
                    lastPageX = e.pageX;
                }
            }

            function onup() {
                $(window).off(eMove, onmove).off(eEnd, onup)
                // diff : the difference between the start transition state and the curent transition state
                var diff = Math.abs(mover.transitionState - startTransition);
                if (diff == 0) return;
                // if move more than half the width of an li
                if (diff > styles.liOuter/2) {
                     // if moved right
                     if (mover.transitionState > startTransition) {   
                         jumpMove(-styles.liOuter * elems, 1, styles.liOuter - diff)
                     // if moved left
                     } else {
                         jumpMove(styles.liOuter * elems, elems, diff - styles.liOuter)
                     }
                // else bounce back 
                } else {
                    var back = mover.transitionState > startTransition ? -diff : diff
                    mover.moveMe(back, speed)
                }
            }
        })
    })();

    return {
        moveRight: function () {
            jumpMove(styles.liOuter * elems, elems, -styles.liOuter)
        },
        moveLeft: function () {
            jumpMove(-styles.liOuter * elems, 1, styles.liOuter)
        },
        getState: function () {
            console.log(state)
            return state;
        },
        moveTo: function (num) {
            if (num < 1 || num > elems || !Number.isInteger(num)) return;
            mover.moveMe(styles.liOuter * (state - num), speed)
            state = num;
        },
        reCalculate: function () { // throttle me!;
            styles.setStyle();
            this.reset();
        },
        reset: function () {
            mover.moveMe(-mover.transitionState, speed);
            state = 1;

        }

    }

}