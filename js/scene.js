$(document).ready(function() {
    $(".scene-mission").mouseenter(function () {
        $(this).find(".scene-mission-overlay").fadeOut(100);
    });
    $(".scene-mission").mouseleave(function () {
        $(this).find(".scene-mission-overlay").fadeIn(100);
    });
});
