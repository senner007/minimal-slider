import $ from 'jquery';
import {
    Mover
} from './mover';
import {
    Styler
} from './styler';
import {
    TouchDrag
} from './touchDrag';
import '../css.css';

export const Move = function (o) {
    var state = 1,
        list = o.ul,
        infiniteScroll = o.infiniteScroll,
        listJs = list[0], // vanilla js object
        speed = listJs.style.transitionDuration, // get css transition duration
        elems = list.children().length; // number of lis

    var mover = Mover(listJs, speed,  function () {
        listJs.dispatchEvent(new CustomEvent('moveEnd', {
            detail: state
        }));
    })

    mover.jumpMove = function (jumpDistance, jumpPoint, distance) {
        if (state === jumpPoint && infiniteScroll) {
            state = jumpPoint == 1 ? elems : 1
            mover.moveMe(jumpDistance, "0s", function () {
                mover.moveMe(distance);
            });
        } else if (state === jumpPoint) {
            // bounce back at end points if no infinte scroll
            mover.moveMe(jumpDistance/elems + distance)
        }
        else {
            mover.moveMe(distance)
            // determine direction based on jumpDistance param
            state = jumpDistance > 0 ? state + 1 : state - 1
        }
    }

    var styles = Styler(list, infiniteScroll, elems);
    styles.setStyle();

    if (o.touchDrag) TouchDrag(list, mover, styles, elems);
   

    return {
        moveRight: function () {
            mover.jumpMove(styles.liOuter * elems, elems, -styles.liOuter)
        },
        moveLeft: function () {
            mover.jumpMove(-styles.liOuter * elems, 1, styles.liOuter)
        },
        getState: function () {
            console.log(state)
            return state;
        },
        moveTo: function (num) {
            if (num < 1 || num > elems || !Number.isInteger(num)) return;
            mover.moveMe(styles.liOuter * (state - num))
            state = num;
        },
        reCalculate: function () { // throttle me!;
            styles.setStyle();
            this.reset();
        },
        reset: function () {
            mover.moveMe(-mover.transitionState);
            state = 1;

        }

    }

}