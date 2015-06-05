/**
 * Created by fhector on 17/11/14.
 */
// Here we do subs management (add/del/modify/whatever)

var highlighted_sub;
var edited_sub;

// When clicked on add, let add it to the list of subs !
function add_sub(event) {
    // Get the right start time, end time, dialog...
    var stime = StartTime;
    var etime = StopTime;
    var dialog = document.getElementById("subtitle-area").value;
    if (dialog != "") {
        // Can we add it ?
        // DO PRE-INSERT TEST
        var auth_sub = true;
        // Lets go through all values
        for (index = 0; index < subs.length; index++) {
            // If
            // Subs start during another subs running
            // Subs end during another subs running
            // Sub run before axisting sub and end after existing sub
            if (stime >= subs[index].stime && stime < subs[index].etime
                ||
                etime > subs[index].stime && etime <= subs[index].etime
                ||
                stime <= subs[index].stime && etime >= subs[index].etime) {
                // YOU SHALL  NOT PASS §§§§
                auth_sub = false;
            }
        }
        if (auth_sub) {
            // Add it to the sub list, position doesn't matter
            subs[subs.length] = {"stime": stime, "etime": etime, "dialog": dialog};
            // Update the subs list
            updateList();
            $('#badge-subtitle').text(subs.length);
            //TODO marche pas pour le premier
            animate('#list_' + (subs.length - 1) + '', 'animated fadeIn');
            document.getElementById("subtitle-area").value = "";

        }
        else {
            $("#err_temps").show();
            animate('#err_temps', 'animated flash');
            animate('#newStartTime', 'animated shake');
            animate('#newStopTime', 'animated shake');
            var wait = window.setTimeout(function () {
                    $("#err_temps").fadeOut();
                }, 3000
            );
            // Can't add bro', sorry =/

        }
    }
    else {
        // Can't add an empty text bro'!
        $("#err_texte").show();
        animate('#err_texte', 'animated flash');
        animate('#subtitle-area', 'animated shake');
        var wait = window.setTimeout(function () {
                $("#err_texte").fadeOut();
            }, 3000
        );
    }
}

// When clicked on del, we delete the sub from subs list, refresh displayed list
function del_sub(event, id_to_del) {
    console.log(event);
    event.stopPropagation();
    // del the item
    subs.splice(id_to_del, 1);
    updateList();
    $('#badge-subtitle').text(subs.length);
    if (edited_sub && edited_sub == id_to_del) {
        cancel_edit(null);
    }

}

/*
 When we want to edit a sub
 Change interface to show the sub to edit, highlight it in the list...
 */
function edit_sub(id_to_edit) {
    // Un-Highlight last highlighted subtitle
    if (highlighted_sub) {
        highlighted_sub.className = "list-group-item";
    }
    // Highlight the selected subtitle
    highlighted_sub = document.getElementById("list_" + id_to_edit);
    highlighted_sub.className = "list-group-item list-group-item-info";
    // Set the fields with subtitle content
    load_start_time(subs[id_to_edit].stime);
    load_stop_time(subs[id_to_edit].etime);
    document.getElementById("subtitle-area").value = subs[id_to_edit].dialog;

    // Clear existing subs
    context.clearRect(0, 0, $('#video-div').width(), $('#video-div').height());

    //repeat_video();


    // Let recompute calculation of duration of video-subation.
    duration();
    // Change the "add" button + behavior to a "edit" button + behavior + cancel button to come back from editing without saving
    bt_save.className = "btn btn-success duration-test hide";
    bt_edit.className = "btn btn-success duration-test";
    bt_edit.addEventListener("click", save_edited_sub, false);
    bt_cancel.className = "btn btn-success";
    bt_cancel.addEventListener("click", cancel_edit, false);
    edited_sub = id_to_edit;
}

// When a sub have been modified, and the user want to save modifications
function save_edited_sub() {
    // Get the right start time, end time, dialog...
    var stime = StartTime;
    var etime = StopTime;
    var dialog = document.getElementById("subtitle-area").value;
    if (dialog != "") {
        // Can we modify it ?
        // DO PRE-MODIF TEST
        var auth_sub = true;
        // Lets go through all values
        for (index = 0; index < subs.length; index++) {
            // If
            // Subs start during another subs running
            // Subs end during another subs running
            // Sub run before an existing sub and end after existing sub
            if ((stime >= subs[index].stime && stime < subs[index].etime
                ||
                etime > subs[index].stime && etime <= subs[index].etime
                ||
                stime <= subs[index].stime && etime >= subs[index].etime) && index != edited_sub) {
                // YOU SHALL  NOT PASS §§§§
                auth_sub = false;
            }
        }
        if (auth_sub) {
            // Add it to the sub list, position doesn't matter
            subs[edited_sub] = {"stime": stime, "etime": etime, "dialog": dialog};
			
			// Un-Highlight the edited subtitle
			highlighted_sub.className = "list-group-item";
			
            // Update the subs list
            updateList();
            //TODO marche pas pour le premier
            animate('#list_' + (subs.length - 1) + '', 'animated fadeIn');
        }
        else {
            // Can't modify bro', sorry =/
            $("#err_temps").show();
            animate('#err_temps', 'animated flash');
            animate('#newStartTime', 'animated shake');
            animate('#newStopTime', 'animated shake');
            var wait = window.setTimeout(function () {
                    $("#err_temps").fadeOut();
                }, 3000
            );
        }
    }
    else {
        // Can't modify to an empty text bro'!
        $("#err_texte").show();
        animate('#err_texte', 'animated flash');
        animate('#subtitle-area', 'animated shake');
        var wait = window.setTimeout(function () {
                $("#err_texte").fadeOut();
            }, 3000
        );
    }
    // Change the "edit" button + behavior to a "play" button + behavior
    bt_save.className = "btn btn-success duration-test";
    bt_edit.className = "btn btn-success duration-test hide";
    bt_edit.removeEventListener("click", save_edited_sub, false);
    bt_cancel.className = "btn btn-success hide";
    bt_cancel.removeEventListener("click", cancel_edit, false);

    // Let's clean the fields :
    // SI POSSIBLE, PAS RESET, MAIS JUSTE REPARTIR SUR LES VALEURS DU SOUS TITRE EN COURS (évite de repartir à 0 alors que t'étais à 1Hxx par exemple)
    //reset_start_stop_time();
    load_start_time(etime);
    load_stop_time(etime);

    document.getElementById("subtitle-area").value = "";
    edited_sub = null;
}

function cancel_edit(event) {
	// Get the right start time, end time
    var stime = StartTime;
    var etime = StopTime;
	
    bt_save.className = "btn btn-success duration-test";
    bt_edit.className = "btn btn-success duration-test hide";
    bt_edit.removeEventListener("click", save_edited_sub, false);
    bt_cancel.className = "btn btn-success hide";
    bt_cancel.removeEventListener("click", cancel_edit, false);
	
	// Un-Highlight the edited subtitle
	highlighted_sub.className = "list-group-item";

    // Let's clean the fields :
    // SI POSSIBLE, PAS RESET, MAIS JUSTE REPARTIR SUR LES VALEURS DU SOUS TITRE EN COURS (évite de repartir à 0 alors que t'étais à 1Hxx par exemple)
    //reset_start_stop_time();
    load_start_time(etime);
    load_stop_time(etime);
    document.getElementById("subtitle-area").value = "";
    edited_sub = null;
}

function download_subs(event) {
    if (subs.length > 0) {
        if (video_name == null) {
            video_name = "test";
        }


        var args = "";
        args += "video=" + video_name;
        for (index = 0; index < subs.length; index++) {
            args += "&nbsubs=" + subs.length;
            args += "&sub" + index + "start=" + subs[index].stime;
            args += "&sub" + index + "end=" + subs[index].etime;
            args += "&sub" + index + "text=" + subs[index].dialog;
        }

        var xhr_object = new XMLHttpRequest();
        xhr_object.open("POST", "handleJSONServlet", false);

        xhr_object.setRequestHeader("Content-type",
            "application/x-www-form-urlencoded");
        xhr_object.send(args);
		
        document.getElementById("frameForDl").src = video_name + '.srt';
    }
}

function add_sub_after(event) {
    event.stopPropagation();

    // Unlight if any
    if (highlighted_sub) {
        highlighted_sub.className = "list-group-item";
    }

    load_start_time(StopTime);
    load_stop_time(StopTime);
    document.getElementById("subtitle-area").value = "";

    // Clear existing subs
    context.clearRect(0, 0, $('#video-div').width(), $('#video-div').height());
    // Set the video at the subtitle time
    video.currentTime = parseFloat(StopTime);
    repeat = false;

    repeat_video();


    // Let recompute calculation of duration of video-subation.
    duration();

}

function add_sub_before(event) {
    event.stopPropagation();
    // Unlight if any
    if (highlighted_sub) {
        highlighted_sub.className = "list-group-item";
    }

    load_start_time(StartTime);
    load_stop_time(StartTime);
    document.getElementById("subtitle-area").value = "";


    // Clear existing subs
    context.clearRect(0, 0, $('#video-div').width(), $('#video-div').height());
    // Set the video at the subtitle time
    video.currentTime = parseFloat(StopTime);
    repeat = false;

    repeat_video();


    // Let recompute calculation of duration of video-subation.
    duration();

}

function updateList() {
    // Update the subs list
    var sublist = document.getElementsByClassName("list-group")[0];
    sublist.innerHTML = "";
    for (index = 0; index < subs.length; index++) {
        sublist.innerHTML += '<li id="list_' + index + '" class="list-group-item" onclick="edit_sub(' + index + ')" >' + (index + 1) + ' | ' + secondesToHMS(subs[index].stime) + ' | ' + secondesToHMS(subs[index].etime) + ' | ' + escapeHTMLEncode(subs[index].dialog) + ' <button type="button" class="btn btn-xs btn-danger pull-right" onclick="del_sub(event, ' + index + ')"><span class="glyphicon glyphicon-trash"></span></button></li>';
    }
}
