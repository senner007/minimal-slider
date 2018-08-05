export default function Layout (list, infiniteScroll) {

    var liOuter,
        minWidth = parseInt(list.find('li').css('min-width')),
        listLiJs = list[0].children; // vanilla js object

    // hack to retrieve css set unit value(%|px)
    listLiJs[0].style.display = 'none';
    var origStyle = window.getComputedStyle(listLiJs[0]);
    var origStyleWidth = origStyle['width'];
    listLiJs[0].style.display = 'block';

    var marginBorder = parseInt(origStyle.marginLeft) + parseInt(origStyle.marginRight) + parseInt(origStyle.borderLeftWidth) + parseInt(origStyle.borderRightWidth);

    return {
        get liOuter() {
            return Math.round(liOuter);
        },
        setStyles: function (elems) {
     
            var ulParentwidth = Math.round(list.parent().outerWidth(true));
            // scale according to width percentage if ulParentwidth is above 2 times the width of the li min-width
            if (origStyleWidth.indexOf('%') != -1 && ulParentwidth / 2 > minWidth) {
                liOuter = parseInt(origStyleWidth.replace('%', '') / 100 * ulParentwidth);
            } else {
                liOuter = parseInt(list.find('li').outerWidth(true));
            }

            (function (index = 0) {
                for (let i = 0; i < listLiJs.length; i++) {
                    if (!listLiJs[i].classList.contains('clone')) {
                        listLiJs[i].style.width = liOuter - marginBorder + 'px';
                        listLiJs[i].style.left = (liOuter) * index++ + (ulParentwidth / 2 - (liOuter / 2)) + 'px';
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

                [listLiJs[0].cloneNode(true),
                listLiJs[1].cloneNode(true),
                listLiJs[elems - 1].cloneNode(true),
                listLiJs[elems - 2].cloneNode(true)]
                .forEach(function (c, i) {
                    c.classList.add('clone');
                    if (i <= 1 ) {                       
                        list.append(c);
                    } else {                     
                        list.prepend(c);                   
                    }
                    c.style.left = parseInt(c.style.left) + elems * (i <= 1 ? liOuter: -liOuter)+ "px";
                });
            }
        },
        addRemove : function (position, elem, elems) {
            var liPos =  list.children().eq(infiniteScroll ? position+2 : position);
            elem ? liPos.after(elem) : liPos.remove();
            this.setStyles(elems);
        }
    }
}