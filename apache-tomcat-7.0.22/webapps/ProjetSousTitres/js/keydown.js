/**
 * Gestion des actions clavier
 */

// Détection de l'utilisation du champ de texte
var subtitle_area = document.getElementById("subtitle-area")
subtitle_area.addEventListener("focus", delkeyDownSwitch, false);
subtitle_area.addEventListener("blur", addkeyDownSwitch, false);

// Activation du listener
addkeyDownSwitch();

function keyDownSwitch(event) {
    if (!onRepeat) {
        switch (event.keyCode) {
            case 68: //d StartTime
                if (!onSync) {
                    select_start_time();
                }
                break;
            case 70: //f StopTime
                if (!onSync) {
                    select_stop_time();
                }
                break;
            case 83: //s Sync
				// Empêche l'écriture du "s" dans le champ de sous-titre
				event.preventDefault();
				
                sync_subtitle();
                break;
            case 60: //< PlayPause
                play_pause_video(event);
                break;
            case 65: //a Avance
                go_forw();
                break;
            case 82: //r Recule
                go_back();
                break;
            case 69: //e Ecrire
                // Passage au mode saisie
                if (!onSync) {
					// Empêche l'écriture du "e" dans le champ de sous-titre
					event.preventDefault();
					
                    $('#subtitle-area').focus();
                }
                break;
        }
    }
}

// Ajout du listener
function addkeyDownSwitch(event) {
    document.addEventListener("keydown", keyDownSwitch, false)
}

// Retrait du listener
function delkeyDownSwitch(event) {
    document.removeEventListener("keydown", keyDownSwitch, false)
}