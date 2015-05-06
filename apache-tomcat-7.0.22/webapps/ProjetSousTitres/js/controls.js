/**
 * Ajout des controles complexes de la vidéo
 */

function onReady_controls() {

    // Sliders
    var seekBar = document.getElementById("seek-bar");
	seekBar.step = 0.01;
    var volumeBar = document.getElementById("volume-bar");
    var badgeVideo = document.getElementById("badge-video");

    // Event listener for the seek bar
    seekBar.addEventListener("input", function () {
        // Calculate the new time
        var time = video.duration * (seekBar.value / 100);

        // Update the video time
        video.currentTime = time;
    });

    // Update the seek bar as the video plays
    video.addEventListener("timeupdate", function () {
        // Calculate the slider value
        var value = (100 / video.duration) * video.currentTime;
        badgeVideo.innerHTML = secondesToHMS(video.currentTime);
		
        // Update the slider value
        seekBar.value = value;
    });

    // Pause the video when the seek handle is being dragged
    seekBar.addEventListener("mousedown", function () {
        video.pause();
    });

    // Play the video when the seek handle is dropped
    seekBar.addEventListener("mouseup", function () {
        if (play) {
            video.play();
        }

    });

    // Event listener for the volume bar
    volumeBar.addEventListener("input", function () {
        // Update the video volume
        video.volume = volumeBar.value;
    });
}