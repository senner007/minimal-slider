import {
    Mover
} from './mover';
import {
    Layout
} from './layout';
import {
    TouchDrag
} from './touchDrag';
 import '../css.css';

export const Slider = function (o) {
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
  
    var layout = Layout(list, infiniteScroll);
    layout.setStyles(elems);

  
    mover.jumpMove = function (direction, distance) {
        distance = distance * direction;
        var jumpPoint = direction < 0 ? elems : 1;
        var jumpDistance = layout.liOuter * elems * -direction;
        if (state === jumpPoint && infiniteScroll) {
            state = jumpPoint === 1 ? elems : 1;
            this.moveMe(jumpDistance, "0s", () => this.moveMe(distance));
        } else if (state === jumpPoint) {
            // bounce back at end points if no infinte scroll
            this.moveMe(jumpDistance/elems + distance);
        }
        else {
            this.moveMe(distance);
            // determine direction based on direction param
            state = direction < 0 ? state + 1 : state - 1;
        }
    }


    if (o.touchDrag) TouchDrag(list, mover, layout);
   
    return {  
        _getTransformState : function () {
            return mover.transitionState
        },
        moveLeft: function () {
            mover.jumpMove(1, layout.liOuter)
        },
        moveRight: function () {
            mover.jumpMove(-1, layout.liOuter)
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
            layout.setStyles(elems);
            this.reset();
        },
        reset: function () {
            mover.moveMe(-mover.transitionState);
            state = 1;

        },
        add : function (elem, position) {
            elems++;
            layout.add(elem, position);
            layout.setStyles(elems)
        },
        remove : function (position) {
            elems--;
            layout.remove(position);
            layout.setStyles(elems)
        }
    }
}
