/**
 * Gestion des Temps HMS
 */
// Correction des dates javascript à cause de la Timezone
var offset_millisecondes = new Date().getTimezoneOffset() * 60000;

//Rajout des 0 supplémentaires
function addZero(x, n) {
    while (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
}

//Converti une durée SS.sss en HH:MM:SS,sss
function secondesToHMS(time) {
    var d = new Date(time * 1000 + offset_millisecondes);
    var h = addZero(d.getHours(), 2);
    var m = addZero(d.getMinutes(), 2);
    var s = addZero(d.getSeconds(), 2);
    var ms = addZero(d.getMilliseconds(), 3);
    return (h + ":" + m + ":" + s + "," + ms);
}

//Converti HH:MM:SS,sss en seconde et millisecondes SS.sss
function HMSTosecondes(hms) {
    var time = hms.toString().split(":");
    var sms = time [2].split(",");
    var h = parseInt(time [0] * 3600);
    var m = parseInt(time [1] * 60);
    var s = parseInt(sms [0]);
    var ms = parseFloat(sms [1] / 1000);
    return (h + m + s + ms);
}

//
function isHMSinTime(hms) {
    // Découpage HMS
    var time = hms.toString().split(":");

    // Si undefined, pas assez ou trop de ":"
    if (typeof time [2] == "undefined" || typeof time [3] != "undefined") {
        return false;
    }

    //Découpage des S,sss
    var sms = time [2].split(",");

    // Si undefined, pas assez ou trop de ","
    if (typeof sms [1] == "undefined" || typeof sms [2] != "undefined") {
        return false;
    }

    // Vérification qu'on a bien le nombre de caractères attendu après le split
    if (time [0].length != 2 || time [1].length != 2 || sms [0].length != 2 || sms [1].length != 3) {
        return false
    }

    // Vérification qu'on a bien que des chiffres
    var patt = new RegExp("\\D");
    if (patt.test(time [0]) || patt.test(time [1]) || patt.test(sms [0]) || patt.test(sms [1])) {
        return false
    }

    // Récupération des durées bornées
    var m = parseInt(time [1]);
    var s = parseInt(sms [0]);
    var ms = parseFloat(sms [1] / 1000);

    // Vérification des valeurs limites
    if (0 > m || m > 60 || 0 > s || s > 60 || 0 > ms || ms > 999) {
        return false;
    }

    // Si la valeur est supérieure à la durée de la vidéo => false
    if (HMSTosecondes(hms) > video.duration) {
        return false
    }

    return true;
}