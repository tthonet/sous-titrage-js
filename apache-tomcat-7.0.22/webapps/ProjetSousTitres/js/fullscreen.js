/**
 * Possibilité d'affichage plein écran de l'outil entier
 */


// Init Var
var a_fullscreen;
var ico_fullscreen;
var txt_fullscreen;
var fullscreen;

fullscreen = false;

//Onload
function onReady_fullscreen() {
    a_fullscreen = document.getElementById("a_fullscreen");
    ico_fullscreen = document.getElementById("ico_fullscreen");
    txt_fullscreen = document.getElementById("txt_fullscreen");
    a_fullscreen.addEventListener("click", start_fullscreen, false);

}

// Find the right method, call on correct element (http://davidwalsh.name/fullscreen)
function launchIntoFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

// Whack fullscreen
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}


function start_fullscreen(event) {
    // Listeners
    a_fullscreen.removeEventListener("click", start_fullscreen, false);
    a_fullscreen.addEventListener("click", stop_fullscreen, false);

    ico_fullscreen.className = "glyphicon glyphicon-remove";
    $('#li_fullscreen').addClass("active");
    txt_fullscreen.innerHTML = "Quitter plein écran";

    // Launch fullscreen for browsers that support it!
    launchIntoFullscreen(document.documentElement);
}

function stop_fullscreen(event) {
    // Listeners
    a_fullscreen.removeEventListener("click", stop_fullscreen, false);
    a_fullscreen.addEventListener("click", start_fullscreen, false);

    // Cancel fullscreen for browsers that support it!
    exitFullscreen();

    // Buttons
    ico_fullscreen.className = "glyphicon glyphicon-fullscreen";
    $('#li_fullscreen').removeClass("active");
    txt_fullscreen.innerHTML = "Lancer plein écran";
}