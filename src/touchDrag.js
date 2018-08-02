import $ from 'jquery';
export const TouchDrag = function (list, mover, layout) {
   
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
            if (diff > layout.liOuter/2) {
                 mover.jumpMove(mover.transitionState > startTransition ? 1 : -1)(layout.liOuter - diff)
            // else bounce back 
            } else {
                mover.moveMe(mover.transitionState > startTransition ? -diff : diff)
            }
        }
    })
}
