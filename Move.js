import $ from 'jquery';

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

    function scrollJump(distance, callback) {
        listJs.style.transitionDuration = "0.0s";
        listJs.style.transform = "translateX(" + distance + "px)";
        transitionState = distance;

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
        listJs.style.transform = "translateX(" + (transitionState + parseInt(distance)) + "px)";
        transitionState += parseInt(distance);
    }

    function setStyle() {

         var ulParentwidth = Math.round(list.parent().outerWidth(true));
        
         if ( !orig ) {
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

            list.prepend(last.css('left', ulParentwidth/2 - liOuter/2 - liOuter + "px").addClass('clone'))
                .prepend(nextLast.css('left', ulParentwidth / 2 - liOuter / 2 - (liOuter*2)  + "px").addClass('clone'))

                .append(first.css('left', (liOuter) * elems + (ulParentwidth / 2 - (liOuter / 2)) + "px").addClass('clone'))
                .append(second.css('left', (liOuter) * (elems + 1) + (ulParentwidth / 2 - (liOuter / 2)) + "px").addClass('clone'));

        }

    }
    setStyle(list);

    return {
        moveRight: function () {
            var distance = '-' + liOuter;
            if (state === elems && infiniteScroll) {
                scrollJump(liOuter, function () {
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
            var distance = '+' + liOuter;
            if (state === 1 && infiniteScroll) {
                scrollJump((-liOuter * (elems)), function () {
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
