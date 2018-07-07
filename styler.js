import $ from 'jquery';

export const Styler = function (list, infiniteScroll, elems) {
    var liOuter,
        lis = list.children().not('.clone'),
        listLiJs = lis[0]; // vanilla js object

    // style retrieves css unit value
    listLiJs.style.display = 'none';
    var orig = window.getComputedStyle(listLiJs)['width'];
    listLiJs.style.display = 'block';

    return {
        get liOuter() {
            return liOuter;
        },
        setStyle: function () {
            var marginBorder = parseInt(lis.outerWidth(true) - lis.width());
            var ulParentwidth = Math.round(list.parent().outerWidth(true));
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
    }
}