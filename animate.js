import $ from 'jquery';
function animate () {

    var promise1 = $("p").animate({
        margin: "+=200"
    }, 1000);

    $.when(promise1)
        .then(function () {
            console.log("fddsdsdf")
            // Once both animations have completed
            // we can then run our additional logic

        });

}

export default animate;