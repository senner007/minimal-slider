export const Mover = function (listJs, moveEndCallback) {
    var isDormant = true; // only fire 1 moveEnd event after multiple repeated move calls
    var transitionState = 0;

    return {
        get transitionState() {
            return transitionState;
        },
        // PARAMS:
        // distance : the distance to move from the current transition state
        // setSpeed : the transition duration
        // callback : append another moveMe call wrapped in setTimeout to allow new transition duration(setSpeed) to be applied
        moveMe: function moveMe(distance, setSpeed, callback) {
            distance = Math.round(distance);
            if (isDormant) {
                isDormant = false;
                listJs.addEventListener('transitionend', function moveend() {
                    isDormant = true;
                    listJs.removeEventListener('transitionend', moveend);
                    moveEndCallback();
                })
            }
            listJs.style.transitionDuration = setSpeed;
            listJs.style.transform = "translateX(" + (transitionState + distance) + "px)";
            transitionState += distance;

            if (!callback) return;
            setTimeout(function () {
                callback();
            }, 0)
        }
    }
}