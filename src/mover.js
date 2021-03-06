export default function Mover (listJs, speed, moveEndCallback) {
    var isDormant = true; // only fire 1 moveEnd event after multiple repeated move calls
    var transitionState = 0;
    var prevSpeed;

    return {
        get transitionState() {
            return transitionState;
        },
        // PARAMS:
        // distance : the distance to move from the current transition state
        // setSpeed : the transition duration, defaults to set css
        // callback : append another moveMe call wrapped in setTimeout to allow new transition duration(setSpeed) to be applied
        moveMe: function moveMe(distance, setSpeed = speed, callback) {
            if (distance === 0) return;
            distance = Math.round(distance);
            if (isDormant) {
                isDormant = false;
                listJs.addEventListener('transitionend', function moveend() {
                    isDormant = true;
                    listJs.removeEventListener('transitionend', moveend);
                    moveEndCallback();
                })
            }
            if ( setSpeed != prevSpeed )  listJs.style.transitionDuration = setSpeed;
            listJs.style.transform = "translateX(" + (transitionState + distance) + "px)";
            transitionState += distance;
            prevSpeed = setSpeed;

            if (!callback) return;

            var blabla = listJs.offsetWidth; // force reflow
            callback();

        }
    }
}