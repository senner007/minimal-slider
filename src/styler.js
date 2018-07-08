import $ from 'jquery';

export const Styler = function (list, infiniteScroll, elems) {
    var liOuter,
        lis = list.children().not('.clone'),
        listLiJs = list[0].children; // vanilla js object

    // hack to retrieve css set unit value(%|px)
    listLiJs[0].style.display = 'none';
    var orig = window.getComputedStyle(listLiJs[0])['width'];
    listLiJs[0].style.display = 'block';

    return {
        get liOuter() {
            return Math.round(liOuter);
        },
        setStyle: function () {
            var ulParentwidth = Math.round(list.parent().outerWidth(true));
            // scale according to width percentage if ulParentwidth is above 2 times the width of the li min-width
            if (orig.indexOf('%') != -1 && ulParentwidth / 2 > parseInt(lis.css('min-width'))) {
                liOuter = parseInt(orig.replace('%', '') / 100 * ulParentwidth)
            } else {
                liOuter = parseInt(lis.outerWidth(true));
            }

            (function (index = 0) {
                var marginBorder = parseInt(lis.outerWidth(true) - listLiJs[0].clientWidth);
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
                for (var paragraph of list[0].querySelectorAll('.clone')) {
                    paragraph.remove();
                }

                var first = listLiJs[0].cloneNode(true);
                var second = listLiJs[1].cloneNode(true);
                var last = listLiJs[elems - 1].cloneNode(true);
                var nextLast = listLiJs[elems - 2].cloneNode(true);

                first.style.left = (liOuter) * elems + (ulParentwidth / 2 - (liOuter / 2)) + "px"
                first.classList.add('clone');

                second.style.left = (liOuter) * (elems + 1) + (ulParentwidth / 2 - (liOuter / 2)) + "px"
                second.classList.add('clone');

                last.style.left = ulParentwidth / 2 - liOuter / 2 - liOuter + "px"
                last.classList.add('clone');

                nextLast.style.left = ulParentwidth / 2 - liOuter / 2 - (liOuter * 2) + "px"
                nextLast.classList.add('clone');

                list.prepend(last)
                    .prepend(nextLast)
                    .append(first)
                    .append(second);
            }
        }
    }
}