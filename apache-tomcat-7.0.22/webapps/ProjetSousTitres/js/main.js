/**
 * Created by afoures on 13/11/14.
 */
// Shared vars
var video, video_name, cvideo, context;
var bt_save, bt_edit, bt_cancel, bt_dl;

var play;
var repeat;
var subs;
var old_txt = "";
subs = new Array();

var sync = false;

var bt_play_pause, bt_record, bt_keep_repeat;
var bt_step_start, bt_step_stop, bt_back, bt_forw;
var bt_add_before, bt_add_after;

// Vérouiller des actions si on rejoue ou synchronise
var onRepeat, onSync;
onRepeat = false;
onSync = false;

var newStartTime;
var newStopTime;

var in_StartTime;
var in_StopTime;
var StartTime;
var StopTime;

var aide_active = false;

var StartTimeInvalidFormat, StopTimeInvalidFormat;

var video_imported = false;

// Set the algos var
repeat = false;
play = false;


// Start script at page loading
onload = doLoad();

function doLoad() {
    video = document.getElementById("video");
    cvideo = document.getElementById("cvideo");
    context = cvideo.getContext("2d");
    in_StartTime = document.getElementById("in_StartTime");
    in_StopTime = document.getElementById("in_StopTime");
    bt_play_pause = document.getElementById("bt_play_pause");
    bt_record = document.getElementById("bt_record");
    bt_step_start = document.getElementById("bt_step_start");
    bt_step_stop = document.getElementById("bt_step_stop");
    bt_keep_repeat = document.getElementById("bt_keep_repeat");
    bt_save = document.getElementById("bt_save");
    bt_back = document.getElementById("bt_back");
    bt_forw = document.getElementById("bt_forw");
    bt_edit = document.getElementById("bt_edit");
    bt_cancel = document.getElementById("bt_cancel");
    bt_dl = document.getElementById("bt_download");
    bt_add_before = document.getElementById("bt_add_before");
    bt_add_after = document.getElementById("bt_add_after");


    // Set the event listeners on buttons
    bt_play_pause.addEventListener("click", play_pause_video, false);
    bt_record.addEventListener("click", sync_subtitle, false);
    bt_step_start.addEventListener("click", select_start_time, false);
    bt_step_stop.addEventListener("click", select_stop_time, false);
    bt_keep_repeat.addEventListener("click", start_stop_keep_repeat, false);
    bt_back.addEventListener("click", go_back, false);
    bt_forw.addEventListener("click", go_forw, false);
    bt_save.addEventListener("click", add_sub, false);
    bt_dl.addEventListener("click", download_subs, false);
    bt_add_after.addEventListener("click", add_sub_after, false);
    bt_add_before.addEventListener("click", add_sub_before, false);
    cvideo.addEventListener("click", play_pause_video, false);

    in_StartTime.addEventListener("input", input_start_time, false);
    in_StopTime.addEventListener("input", input_stop_time, false);

    // Set the MouseScroll event listeners
    $('#in_StartTime').bind('DOMMouseScroll', ScrollStartTime);
    $('#in_StopTime').bind('DOMMouseScroll', ScrollStopTime);
    $('#video-div').bind('DOMMouseScroll', scroll_video);

    // Empecher de scroller la page quand on scroll dans un élément
    $('.scrollable').bind('mousewheel DOMMouseScroll', function (e) {
        var e0 = e.originalEvent,
            delta = e0.wheelDelta || -e0.detail;
        this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
        e.preventDefault();
    });

    // Let's put an event on video.loadedmetadata to read height & width
    video.addEventListener("loadedmetadata", setCanva, false);

    // Let's put an event on video.play to copy to canva
    video.addEventListener("play", setCanva, false);

    //
    reset_start_stop_time();

    //
    video_name = "vid01.webm";

}

// Remet à 0 les valeurs de StartTime et StopTime
function reset_start_stop_time() {
    // RàZ StartTime
    StartTime = 0;
    $('#in_StartTime').val(secondesToHMS(0));

    // RàZ StopTime
    StopTime = 0;
    $('#in_StopTime').val(secondesToHMS(0));

    // RàZ Durée
    duration();
}

// Charger une durée pour StartTime
function load_start_time(time) {
    // Memorize start time
    StartTime = time;

    // Display in HMS
    $('#in_StartTime').val(secondesToHMS(time));

    // Enlève l'état d'erreur
    $('#Recording-StartTime').removeClass('has-error');
    StartTimeInvalidFormat = false;

    // Mise à jour de la durée
    duration();
}

// Charger une durée pour StopTime
function load_stop_time(time) {
    // Memorize start time
    StopTime = time;

    // Display in HMS
    $('#in_StopTime').val(secondesToHMS(time));

    // Enlève l'état d'erreur
    $('#Recording-StopTime').removeClass('has-error');
    StopTimeInvalidFormat = false;

    // Mise à jour de la durée
    duration();
}

// Enregistre la date courante de la vidéo comme date de début
function select_start_time(event) {
    // Memorize start time
    load_start_time(video.currentTime);

    // Set animation
    animate('#Recording-StartTime', 'animated pulse');
}

// Enregistre la date courante de la vidéo comme date d'arret
function select_stop_time(event) {
    // Memorize stop time
    load_stop_time(video.currentTime);

    // Set animation
    animate('#Recording-StopTime', 'animated pulse');
}

// Scroll dans le champ StartTime
function ScrollStartTime(event) {
    // Positionne la vidéo à la nouvelle date
    video.currentTime = StartTime - event.originalEvent.detail / 3;

    // Enregistre la valeur comme StartTime
    select_start_time(event);
}

// Scroll dans le champ StopTime
function ScrollStopTime(event) {
    // Positionne la vidéo à la nouvelle date
    video.currentTime = StopTime - event.originalEvent.detail / 3;

    // Enregistre la valeur comme StopTime
    select_stop_time(event);
}

function duration() {
    // Calcul de la durée
    var DurationTime = StopTime - StartTime;


    // Affichage en fonction de la durée
    if (DurationTime < 0 && !sync || StartTimeInvalidFormat || StopTimeInvalidFormat) { // DANGER
        // Set skin to new behavior
        $('#DurationTime').addClass("has-error");
        $('#ico_DurationTime').addClass("glyphicon-remove");
        $('#bt_save').addClass("btn-danger");
        $('#add-panel').addClass('panel-danger');

        // Désactiver les boutons
        $('.duration-test').addClass('disabled');

        // Affichage du texte par calcul inverse (sinon problème de date)
        if (StartTimeInvalidFormat || StopTimeInvalidFormat) {
            $('#in_DurationTime').val("-Date invalide-");
        } else {
            $('#in_DurationTime').val("- " + secondesToHMS(StartTime - StopTime) + "(Durée négative)");
        }

        $('#Recording-StartTime').addClass('has-warning');
        $('#Recording-StopTime').addClass('has-warning');

    } else if (DurationTime == 0 || sync) { //WARNING (quand RàZ ou Sync)
        // Set skin to new behavior
        $('#DurationTime').addClass("has-error");
        $('#ico_DurationTime').addClass("glyphicon-remove");
        $('#bt_save').addClass("btn-danger");
        $('#add-panel').removeClass('panel-danger').addClass('panel-warning');

        // Désactiver les boutons
        $('.duration-test').addClass('disabled');

        // Affichage du texte
        if (sync) {
            $('#in_DurationTime').val("Synchronisation");
        } else {
            $('#in_DurationTime').val("-Durée nulle-");
            $('#Recording-StartTime').addClass('has-warning');
            $('#Recording-StopTime').addClass('has-warning');

        }
    } else { // OK
        // Set skin to new behavior
        $('#DurationTime').removeClass("has-error");
        $('#ico_DurationTime').removeClass("glyphicon-remove");
        $('#bt_save').removeClass("btn-danger");
        $('#add-panel').removeClass('panel-danger').removeClass('panel-warning');
        $('#Recording-StartTime').removeClass('has-warning');
        $('#Recording-StopTime').removeClass('has-warning');

        // Réactiver les boutons
        $('.duration-test').removeClass('disabled');

        // Affichage de la durée
        $('#in_DurationTime').val(secondesToHMS(DurationTime));

    }
}

// lance la vidéo, change le bouton play pour le pause, et set les events
function play_pause_video(event) {
    if (sync) {
        sync_subtitle(event);
    } else if (play) {
        // On pause la vidéo
        video.pause();
        play = false;

        // Set button to old behavior
        $('#ico_play_pause').removeClass('glyphicon-pause');
        $('#bt_play_pause').removeClass('btn-info');

    } else {
        // On lit la vidéo
        video.play();
        play = true;

        // Set button to new behavior
        $('#ico_play_pause').addClass('glyphicon-pause');
        $('#bt_play_pause').addClass('btn-info');
    }
}

// Démarre la lecture de la vidéo sans passer par la fonction start/stop et sans toucher la variable "play"
function bypass_play() {
    if (!play) {
        video.play()
        $('#ico_play_pause').removeClass('glyphicon-play').addClass('glyphicon-pause');
    }
}

// Arrête la lecture de la vidéo sans passer par la fonction start/stop et sans toucher la variable "play"
function bypass_pause() {
    if (!play) {
        video.pause()
        $('#ico_play_pause').removeClass('glyphicon-pause').addClass('glyphicon-play');
    }
}

// <1> Enregistre la date de début, lance la vidéo, <2> enregistre la date de fin, arrête la vidéo
function sync_subtitle(event) {
    if (sync) {
        // On termine la synchronisation
        sync = false;

        // On garde le contexte de lecture par rapport à avant la sync
        bypass_pause();

        // Réactivation des boutons
        $('.disabled-on-record').removeClass('disabled');
        onSync = false;
        $('#bt_keep_repeat').removeClass('disabled');

        // Memorize stop time
        select_stop_time(event);

        // Set button to new behavior
        $('#ico_record').removeClass('fa-circle-o-notch fa-spin').addClass('fa-circle');
        $('#bt_record').removeClass('btn-danger');
        $('#txt_record').addClass('text-hide');

        // Set animation
        animate('#Recording-StopTime', 'animated pulse');
        animate('#subtitle-area', 'animated pulse');

        // Passage au mode saisie
        $('#subtitle-area').focus();

    } else {
        // On démarre la synchronisation
        sync = true;

        // Force la lecture de la vidéo le temps de la synchronisation
        bypass_play();

        // Désactivation des boutons
        $('.disabled-on-record').addClass('disabled');
        onSync = true;
        $('#bt_keep_repeat').addClass('disabled');

        // Memorize start time
        select_start_time(event);

        // Set button to new behavior
        $('#ico_record').removeClass('fa-circle').addClass('fa-circle-o-notch fa-spin');
        $('#bt_record').addClass('btn-danger');
        $('#txt_record').removeClass('text-hide');
    }
}

//Se déplacer dans la vidéo au scroll
function scroll_video(event) {
    video.currentTime = video.currentTime - event.originalEvent.detail;
}

// Recule de 5 secondes
function go_back(event) {
    video.currentTime = video.currentTime - 5;
}

// Avance de 5 secondes
function go_forw(event) {
    video.currentTime = video.currentTime + 5;
}

// Choix du type de répétition
function start_stop_keep_repeat(event) {
    if (repeat) {
        // On arrête le keep_repeat
        repeat = false;
        animate('#bt_keep_repeat', 'animated pulse');
    } else {
        // On active le keep_repeat
        repeat = true;
        repeat_video(event);
    }
}


function repeat_video(event) {
    // On se place au début de la séquence
    video.currentTime = StartTime+0.001;

    // Set button to new behavior
    $('#ico_keep_repeat').addClass('fa-spin');
    $('.disabled-on-repeat').addClass('disabled');
    onRepeat = true;

    // On force la lecture
    bypass_play();

    // Arrêt ou répétition
    setTimeout(function () {
        if (repeat) {
            repeat_video(event);
        } else {
            $('.disabled-on-repeat').removeClass('disabled');
            onRepeat = false;
            $('#ico_keep_repeat').removeClass('fa-spin');

            // On repasse dans l'état de lecture précédent
            video.currentTime = StopTime;
            bypass_pause();
        }
    }, (StopTime - StartTime) * 1000)

}


function resizeContent() {
    $height = $('#video-div').height() - 20;
    $('#subtitle-list').height($height);
    cvideo.width = $('#video-div').width();
    cvideo.height = $('#video-div').height();
}


function setCanva(event) {
    cvideo.width = $('#video-div').width();
    cvideo.height = $('#video-div').height();
    cvideo.style.top = $("#video-panel-heading").outerHeight(true) + 1 + "px";
    cvideo.style.left = $("#video-panel-heading").offset().left + "px";

    draw(video, context, cvideo.width, cvideo.height);
}

/*
 Draw all subs and images over the canva
 Called every 20ms
 */
function draw(v, c, w, h) {
    if (v.paused || v.ended) return false;
    // Print subs
    write(sub_to_print(), c, w, h);
	 writeImage(v,c,w,h);
    setTimeout(draw, 20, v, c, w, h);
}

// Write a nice text on the bottom of a canva
// If we replace the canva with a div, we could skip 50% of that.
function write(txt, c, w, h) {
    if (old_txt != txt) {
        c.clearRect(0, 0, w, h);
        old_txt = txt;
    }
    // If texte to write
    if (txt) {
        // Set the canva
        c.textAlign = 'center';
        c.fillStyle = 'white';
        c.strokeStyle = 'black';
        c.font = 'bold 30px Sans-serif';
        // Display nicely the sub :
        var words = txt.split(' ');
        var line = '';
        var lineHeight = 30;
        var y = h - 100;
        // Split the text so it's not too long for the canva.
        // Create lines where it's needed.
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = c.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > w && n > 0) {
                c.fillText(line, w / 2, y);
                c.strokeText(line, w / 2, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        c.fillText(line, w / 2, y);
        c.strokeText(line, w / 2, y);

        c.fill();
        c.stroke();
    } else { // Clean the canva
        c.clearRect(0, 0, w, h);
    }
    old_txt = txt;

}

/*
 Search subs to display at a time and return thems
 */
function sub_to_print() {
    var ctime = video.currentTime;
    for (index = 0; index < subs.length; index++) {
        // If sub already start and not already end
        if (ctime >= subs[index].stime && ctime <= subs[index].etime) {
            return (subs[index].dialog);
        }
    }
    return (false);
}


// Effectue les animations
function animate(element_ID, animation) {
    $(element_ID).addClass(animation);
    var wait = window.setTimeout(function () {
            $(element_ID).removeClass(animation)
        }, 1300
    );
}

$(document).ready(function () {
    resizeContent();
    $(window).resize(function () {
        resizeContent();
    });
});


function input_start_time(event) {
    if (isHMSinTime(in_StartTime.value)) {
        load_start_time(HMSTosecondes(in_StartTime.value));
    } else {
        $('#Recording-StartTime').addClass('has-error');
        StartTimeInvalidFormat = true;
        duration();
    }
}

function input_stop_time(event) {
    if (isHMSinTime(in_StopTime.value)) {
        load_stop_time(HMSTosecondes(in_StopTime.value));
    } else {
        $('#Recording-StopTime').addClass('has-error');
        StopTimeInvalidFormat = true;
        duration();
    }
}
