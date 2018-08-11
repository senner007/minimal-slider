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

    function createClones (arr, position) {   
            return arr.map((c) => {
                var clone = listLiJs[c -1].cloneNode(true)
                clone.classList.add('clone');    
                clone.style.left = parseInt(clone.style.left) + listLiJs.length * position + "px";
                return clone;           
            }); 
    }

    function addClones(clones, addfn) {
        clones.forEach((clone) => {          
            list[addfn](clone);                                     
         });
    }

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


                // this causes babel to inject symbol and iterator code which requires import 'babel-polyfill' for ie 
                // https://babeljs.io/docs/en/babel-plugin-transform-es2015-for-of
                // https://daverupert.com/2017/10/for-of-loops-are-bad/
                // TODO : add to es-lint : no-for-of-loops
                // for (let li of list[0].querySelectorAll('.clone')) {
                //     li.remove();
                // }
                (function deleteClones () {
                    var clones = document.getElementsByClassName('clone');
                    while(clones[0]) {
                        clones[0].parentNode.removeChild(clones[0]);
                    }
                }());
                
                addClones(createClones([1,2], liOuter), 'append');
                addClones(createClones([listLiJs.length, listLiJs.length -1], -liOuter), 'prepend')
       
            }
        },
        addRemove : function (position, elem) {
            var liPos =  list.children().eq(infiniteScroll ? position+2 : position);
            elem ? liPos.after(elem) : liPos.remove();
            this.setStyles();
        }
    }
}