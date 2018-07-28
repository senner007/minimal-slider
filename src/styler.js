import $ from 'jquery';

export const Styler = function (list, infiniteScroll, elems) {

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