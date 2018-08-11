import Mover from './mover';
import Layout from './layout';
import TouchDrag from './touchDrag';
import setPolyFills from './polyfills';

setPolyFills();

export const Slider = function (o) {
    var state = 1,
        list = o.ul,
        infiniteScroll = o.infiniteScroll,
        listJs = list[0], // vanilla js object
        speed = listJs.style.transitionDuration, // get css transition duration
        elems = list.children().length; // number of lis

    var mover = Mover(listJs, speed, function () {
        listJs.dispatchEvent(new CustomEvent('moveEnd', {
            detail: state
        }));
    })

    var layout = Layout(list, infiniteScroll);
    layout.setStyles();

    mover.jumpMove = function (direction) {
        var isJumpPoint = state === (direction < 0 ? elems : 1);
        if (isJumpPoint && infiniteScroll) {
            state = state === 1 ? elems : 1
        } else if (!isJumpPoint) {
            state = state - direction;
        }

        return function (distance, fn = (dist) => dist * direction) {
            if (isJumpPoint && infiniteScroll) {
                mover.moveMe(-fn(layout.liOuter * elems), "0s", () => mover.moveMe(fn(distance)));
            } else {
                // bounce back at end points if no infinte scroll or move left/right
                mover.moveMe(isJumpPoint ? -fn(layout.liOuter - distance) : fn(distance));
            }
        }
    }

    if (o.touchDrag) TouchDrag(list, mover, layout);

    return {
        _getTransformState: function () {
            return mover.transitionState
        },
        moveLeft: function () {
            mover.jumpMove(1)(layout.liOuter);
        },
        moveRight: function () {
            mover.jumpMove(-1)(layout.liOuter);
        },
        getState: function () {
            console.log(state)
            return state;
        },
        moveTo: function (num) {
            if (num < 1 || num > elems || !Number.isInteger(num)) return;
            mover.moveMe(layout.liOuter * (state - num))
            state = num;
        },
        reCalculate: function () { // throttle me!;
            layout.setStyles();
            this.reset();
        },
        reset: function () {
            mover.moveMe(-mover.transitionState);
            state = 1;
        },
        add: function (elem, position) {
            layout.addRemove(position, elem, ++elems);
        },
        remove: function (position) {
            layout.addRemove(position, false, --elems);
        }
    }
}