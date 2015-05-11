/**
 * Fonctionnalités pour l'import d'une vidéo locale et le chargement de ses propriétés basiques
 */
window.URL = window.URL || window.webkitURL;

var fileSelect = document.getElementById("fileSelect"),
    fileElem = document.getElementById("fileElem");

$('#import_alert').addClass('hide');

fileSelect.addEventListener("click", function (e) {
    if (fileElem) {
        fileElem.click();
    }
    e.preventDefault(); // prevent navigation to "#"
}, false);

function handleFiles(files) {
    if (!files.length) {
        //
    } else {
        //TODO Modifier pour créer l'attribut vidéo avec src et tout
        video.src = window.URL.createObjectURL(files[0]);
		
		// Enlève l'extension au nom de la vidéo
		clean_name = files[0].name.substr(0, files[0].name.lastIndexOf('.'));
		
		loadJSONImages(clean_name);
		 
		// Définit le nom de la vidéo sans l'extension 
		video_name = clean_name;
		  
        $("#import-div").fadeOut();
        $("#interface-div").fadeIn();
        video_imported = true;
        if (aide_active) {
            hopscotch.nextStep();
        }
        video.addEventListener('loadedmetadata', function () {
            $("#badge-video").text(secondesToHMS(video.currentTime));
            $("#badge-duration").text(secondesToHMS(video.duration));
            $("#title-video").text(files[0].name);
            resizeContent();
        });
    }
}
