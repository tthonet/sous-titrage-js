bt_help = document.getElementById("bt_help")
bt_help.addEventListener("click", start_aide, false);

var startBtnId = 'bt_help',
    calloutId = 'startTourCallout',
    mgr = hopscotch.getCalloutManager();

function onReady_aide() {


    // Looking at the page for the first(?) time.
    setTimeout(function () {
        mgr.createCallout({
            id: calloutId,
            target: startBtnId,
            placement: 'bottom',
            title: 'Présentation',
            content: 'Start by taking an example tour to see the Editor in action!',
            yOffset: -25,
            arrowOffset: 20,
            width: 240
        });
    }, 100);

    setTimeout(function () {
        mgr.removeAllCallouts();
    }, 4000);

}

function test_imported() {

}

function start_aide(event) {
    // Define the tour!
    var tour = {
        id: "hello-hopscotch",
        onStart: (function () {
            aide_active = true;
        }),
        onEnd: (function () {
            aide_active = false;
        }),
        steps: [
            {
                title: "Présentation de l'éditeur de sous-titres",
                content: "Cliquez sur next pour poursuivre la présentation",
                target: "#aide_1",
                placement: "right",
                onNext: (function () {
                    if (video_imported) {
                        hopscotch.showStep(2)
                    }
                })
            },
            {
                title: "Sélectionner une vidéo",
                content: "Cliquez sur le bouton et sélectionnez une vidéo pour pouvoir continuer",
                target: "#aide_2",
                placement: "bottom",
                showNextButton: video_imported
            },
            {
                title: "Visionnage de la vidéo",
                content: "Dans ce cadre se trouve la vidéo que vous avez sélectionnée <br> Vous pouvez scroller dans la vidéo pour avancer/reculer et cliquer pour play/pause",
                target: "#aide_3",
                placement: "right"
            }
            ,
            {
                title: "Contrôles de la vidéo",
                content: "Ici se trouvent les contrôles principaux de la vidéo pour s'y déplacer et définir les dates de début et de fin du sous-titre",
                target: "#aide_4",
                placement: "right"
            },
            {
                title: "Bouton synchronisation",
                content: " Le bouton : <button type='button' class='btn btn-warning'> <span class='fa fa-circle'></span></button> permet de lancer une synchronisation : sauvegarde la date de départ et lance la lecture de la vidéo. Il suffit d'arrêter la synchronisation pour enregistrer la date de fin   ",
                target: "#aide_5",
                placement: "top"
            },
            {
                title: "Saisie du sous-titre",
                content: "Ici vous pouvez saisir le texte de votre sous-titre et agir sur les dates de début et de fin.",
                target: "#aide_6",
                placement: "right"
            },
            {
                title: "Dates de début et de fin",
                content: "Le format des dates doit être le suivant : HH:MM:SS,sss. <br> Vous pouvez scroller dans le champ pour modifier la valeur.",
                target: "#aide_9",
                placement: "top"
            },
            {
                title: "Se caller sur le sous-titre",
                content: "< : se met à la date de debut du sous-titre courant <br>> : se met à la date de fin du sous-titre courant.",
                target: "#aide_10",
                placement: "right"
            },
            {
                title: "Liste des sous-titres",
                content: "Affiche la liste des sous-titres que vous avez saisis. <br>Cliquer sur un sous-titre permet de le rejouer et de modifier les dates et le texte. <br>Il est possible de supprimer des sous-titres.",
                target: "#aide_7",
                placement: "left"
            },
            {
                title: "Téléchargement des sous-titres",
                content: "Cliquez ici pour télécharger les sous-titres que vous avez saisis.",
                target: "#aide_8",
                placement: "right"
            }


        ]
    };

// Start the tour!
    mgr.removeAllCallouts();
    hopscotch.startTour(tour, 0);
}