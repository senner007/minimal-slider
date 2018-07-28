const Mover = function (listJs, speed, moveEndCallback) {
    var isDormant = true; // only fire 1 moveEnd event after multiple repeated move calls
    var transitionState = 0;
    var prevSpeed;

    return {
        get transitionState() {
            return transitionState;
        },
        // PARAMS:
        // distance : the distance to move from the current transition state
        // setSpeed : the transition duration, defaults to set css
        // callback : append another moveMe call wrapped in setTimeout to allow new transition duration(setSpeed) to be applied
        moveMe: function moveMe(distance, setSpeed = speed, callback) {
            if (distance === 0) return;
            distance = Math.round(distance);
            if (isDormant) {
                isDormant = false;
                listJs.addEventListener('transitionend', function moveend() {
                    isDormant = true;
                    listJs.removeEventListener('transitionend', moveend);
                    moveEndCallback();
                })
            }
            if ( setSpeed != prevSpeed )  listJs.style.transitionDuration = setSpeed;
            listJs.style.transform = "translateX(" + (transitionState + distance) + "px)";
            transitionState += distance;
            prevSpeed = setSpeed;

            if (!callback) return;
            setTimeout(function () {
                callback();
            },  20) // wait for the css to apply
        }
    }
};

const Styler = function (list, infiniteScroll, elems) {

    var liOuter,
        lis = list.children().not('.clone'),
        listLiJs = list[0].children; // vanilla js object

    // hack to retrieve css set unit value(%|px)
    listLiJs[0].style.display = 'none';
    var origStyle = window.getComputedStyle(listLiJs[0]);
    var origStyleWidth = origStyle['width'];
    listLiJs[0].style.display = 'block';

    var marginBorder =  parseInt(origStyle.marginLeft) + parseInt(origStyle.marginRight)+ parseInt(origStyle.borderLeftWidth) + parseInt(origStyle.borderRightWidth)


    return {
        get liOuter() {
            return Math.round(liOuter);
        },
        setStyles: function () {
            var ulParentwidth = Math.round(list.parent().outerWidth(true));
            // scale according to width percentage if ulParentwidth is above 2 times the width of the li min-width
            if (origStyleWidth.indexOf('%') != -1 && ulParentwidth / 2 > parseInt(lis.css('min-width'))) {
                liOuter = parseInt(origStyleWidth.replace('%', '') / 100 * ulParentwidth)
            } else {
                liOuter = parseInt(lis.outerWidth(true));           
            }

            (function (index = 0) {
                for (let i = 0; i < listLiJs.length; i++) {
                    if (!listLiJs[i].classList.contains('clone')) {
                        listLiJs[i].style.width = liOuter - marginBorder + 'px'
                        listLiJs[i].style.left = (liOuter) * index++ + (ulParentwidth / 2 - (liOuter / 2)) + 'px'
                    }
                }
            })()

            // append clones to appear infinite
            if (infiniteScroll) {
                //  list[0].querySelectorAll('.clone') remove 
                // Array.prototype.forEach.call(list[0].querySelectorAll('.clone'), function (node) {
                //     node.parentNode.removeChild(node);
                // });
                for (let li of list[0].querySelectorAll('.clone')) {
                    li.remove();
                }

                var firstClone = listLiJs[0].cloneNode(true);
                var secondClone = listLiJs[1].cloneNode(true);
                var lastClone = listLiJs[elems - 1].cloneNode(true);
                var nextLastClone = listLiJs[elems - 2].cloneNode(true);

                firstClone.style.left = (liOuter) * elems + (ulParentwidth / 2 - (liOuter / 2)) + "px"
                firstClone.classList.add('clone');

                secondClone.style.left = (liOuter) * (elems + 1) + (ulParentwidth / 2 - (liOuter / 2)) + "px"
                secondClone.classList.add('clone');

                lastClone.style.left = ulParentwidth / 2 - liOuter / 2 - liOuter + "px"
                lastClone.classList.add('clone');

                nextLastClone.style.left = ulParentwidth / 2 - liOuter / 2 - (liOuter * 2) + "px"
                nextLastClone.classList.add('clone');

                list.prepend(lastClone)
                    .prepend(nextLastClone)
                    .append(firstClone)
                    .append(secondClone);
            }
        }
    }
}

const TouchDrag = function (list, mover, styles) {
   
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
                     mover.jumpMove(+1, styles.liOuter - diff)
                 // if moved left
                 } else {
                     mover.jumpMove(-1, styles.liOuter - diff)
                 }
            // else bounce back 
            } else {
                mover.moveMe(mover.transitionState > startTransition ? -diff : diff)
            }
        }
    })
}

const Slider = function (o) {
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
  
    var styles = Styler(list, infiniteScroll, elems);
    styles.setStyles();

  
    mover.jumpMove = function (direction, distance) {
        distance = distance * direction;
        var jumpPoint = direction < 0 ? elems : 1;
        var jumpDistance = styles.liOuter * elems * -direction;
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


    if (o.touchDrag) TouchDrag(list, mover, styles);
   
    return {  
        moveLeft: function () {
            mover.jumpMove(1, styles.liOuter)
        },
        moveRight: function () {
            mover.jumpMove(-1, styles.liOuter)
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
            styles.setStyles();
            this.reset();
        },
        reset: function () {
            mover.moveMe(-mover.transitionState);
            state = 1;

        },
        _getTransformState : function () {
            return mover.transitionState
        }

    }

}

