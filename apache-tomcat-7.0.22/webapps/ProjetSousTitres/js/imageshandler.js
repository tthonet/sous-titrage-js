var imgInfo;

function loadJSONImages(name) {
	
	// Load JSON file
	var xhr_object=new XMLHttpRequest();
	xhr_object.open("GET","JSON/" + name + "_images.json",true);
				
	
	xhr_object.onreadystatechange  = function() { 
	     if(xhr_object.readyState  == 4) {
				console.log("JSON received");
				var aux = eval('('+xhr_object.responseText+')');
				imgInfo = aux.images;
	
				for (var i=0;i<imgInfo.length;i++) {
					var divImg = document.getElementById("imgContainer");
					var imgNew = document.createElement('img');
					imgNew.setAttribute('id', 'img' + i);
					imgNew.setAttribute('src', 'img/' + imgInfo[i].name);
					imgNew.style.display = "none";	
					divImg.appendChild(imgNew);
				}
	     }
	}; 
	xhr_object.send(null);

}

function writeImage(v,c,w,h) {
	// Cherche si une image doit être affichée
	var afficher = -1;
	for (var i=0; i<imgInfo.length;i++) {
		if (imgInfo[i].start <= v.currentTime && imgInfo[i].end >= v.currentTime) {
			afficher = i;
		}
	}

	if (afficher > -1) {
		var imgToDraw = document.getElementById('img'+afficher);
		c.drawImage(imgToDraw,0,0,imgToDraw.width,imgToDraw.height,imgInfo[afficher].x,imgInfo[afficher].y,imgInfo[afficher].w,imgInfo[afficher].h);
	}
}
