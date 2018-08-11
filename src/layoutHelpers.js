function cloneCurry(elems, list) {

    return function createClones(arr, factor) {

        arr = arr.map((c) => {
            var clone = list[c - 1].cloneNode(true)
            clone.classList.add('clone');
            clone.style.left = parseInt(clone.style.left) + elems * factor + "px";
            return clone;
        });

        return {
            addClones: function () {
                arr.forEach((clone) => list[0].parentNode.appendChild(clone));
            },
            prependClones: function () {
                arr.forEach((clone) => list[0].parentNode.insertBefore(clone, list[0]));
            }
        }
    }
}

function getOrigStyles(liElem) {

    liElem.style.display = 'none';
    var origStyle = window.getComputedStyle(liElem);
    var origWidth = origStyle['width'];
    var minWidth = origStyle['min-width'];
    liElem.style.display = 'block';

    return {
        width: origWidth,
        minWidth: parseInt(minWidth),
        marginBorder: parseInt(origStyle.marginLeft) + parseInt(origStyle.marginRight) + parseInt(origStyle.borderLeftWidth) + parseInt(origStyle.borderRightWidth)
    }

}

function outerWidth(el) {
    var width = el.offsetWidth;
    var style = getComputedStyle(el);

    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return Math.round(parseInt(width));
}

HTMLCollection.prototype.toArray = function () {
    return [].slice.call(this)
};

export {
    cloneCurry,
    getOrigStyles,
    outerWidth
}