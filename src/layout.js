import {cloneCurry, getOrigStyles} from './layoutHelpers';

export default function Layout (list, infiniteScroll) {

    var liOuter,
        minWidth = parseInt(list.find('li').css('min-width')),
        listLiJs = list[0].children; // vanilla js object

    var orig = getOrigStyles(listLiJs[0]);

    return {
        get liOuter() {
            return Math.round(liOuter);
        },
        setStyles: function () {
     
            var ulParentwidth = Math.round(list.parent().outerWidth(true));
            // scale according to width percentage if ulParentwidth is above 2 times the width of the li min-width

            liOuter = (function () {
                if (orig.width.indexOf('%') != -1 && ulParentwidth / 2 > minWidth) {
                    return parseInt(orig.width.replace('%', '') / 100 * ulParentwidth);
                }          
                return parseInt(list.find('li').outerWidth(true));
            }());

          
            (function (index = 0) {
                Array.from(listLiJs).forEach((v,i) => {
                     if (!v.classList.contains('clone')) {
                        v.style.width = liOuter - orig.marginBorder + 'px';
                        v.style.left =  liOuter * index++ + (ulParentwidth / 2 - (liOuter / 2)) + 'px';
                     }
                })
            })()
         
            if (infiniteScroll) {

                // for (let li of list[0].querySelectorAll('.clone')) {
                //     li.remove();
                // }
                // this causes babel to inject symbol and iterator code which requires import 'babel-polyfill' for ie 
                // https://babeljs.io/docs/en/babel-plugin-transform-es2015-for-of
                // https://daverupert.com/2017/10/for-of-loops-are-bad/
                // TODO : add to es-lint : no-for-of-loops
              

                (function deleteClones () {
                    Array.from(listLiJs).forEach(v => {
                        if (v.classList.contains('clone')) { 
                            v.parentNode.removeChild(v)
                        }
                    })    
                }());
               
                (function addClones (elems = listLiJs.length) {
                    var createClones  = cloneCurry(elems, listLiJs);
                    createClones([1,2], liOuter).addClones();
                    createClones([elems , elems -1], -liOuter).prependClones();
                 }());              

            }
        },
        addRemove : function (position, elem) {
            var liPos =  list.children().eq(infiniteScroll ? position+2 : position);
            elem ? liPos.after(elem) : liPos.remove();
            this.setStyles();
        }
    }
}