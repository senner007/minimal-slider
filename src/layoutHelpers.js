function cloneCurry (elems, list) { 
         
    return function createClones (arr, factor) {   

        arr = arr.map((c) => {
            var clone = list[c -1].cloneNode(true)
            clone.classList.add('clone');    
            clone.style.left = parseInt(clone.style.left) + elems * factor + "px";
            return clone;           
        }); 
        
        return {
            addClones: function() {
                arr.forEach((clone) => list[0].parentNode.appendChild(clone));
            },
            prependClones: function () {
                arr.forEach((clone) => list[0].parentNode.insertBefore(clone, list[0]));
            }
        }
    }
}

function getOrigStyles (liElem) { 

    liElem.style.display = 'none';
    var origStyle = window.getComputedStyle(liElem);
    var origWidth = origStyle['width'];
    liElem.style.display = 'block';

    return {
        width : origWidth,
        marginBorder : parseInt(origStyle.marginLeft) + parseInt(origStyle.marginRight) + parseInt(origStyle.borderLeftWidth) + parseInt(origStyle.borderRightWidth)
    }

}



export {cloneCurry, getOrigStyles}