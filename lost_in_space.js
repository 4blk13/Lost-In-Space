"use strict"
window.onload = function() {
	
	var canvas = document.getElementById('game_area');
	var context = canvas.getContext("2d");

	function drawVaisseau(x, y){
		context.strokeStyle = 'green';
		context.lineWidth = 5;     
		                        
		context.beginPath();       
		context.moveTo(x - 25, y);
		context.lineTo(x, y - 25);
		context.lineTo(x + 25, y);
		context.lineTo(x - 25, y);
		context.stroke();
	}

	function drawEnnemi(xEnnemi, yEnnemi){
		context.strokeStyle = 'red';
		context.lineWidth = 5;     
		                        
		context.beginPath();       
		context.moveTo(xEnnemi, yEnnemi);
		context.lineTo(xEnnemi + 50, yEnnemi);
		context.lineTo(xEnnemi + 25, yEnnemi + 25);
		context.lineTo(xEnnemi, yEnnemi);
		context.stroke();
	}

	function drawBalle(xBalle, yBalle){
		context.fillStyle = "white";
		context.fillRect(xBalle, yBalle, 5 , 5);

	}

	function arrayClearFalse(array){
		let array2 = array.filter(function(v) {return v != false;});	
		return array2
	}

	window.addEventListener('keydown', function() {
		if (Vaisseau != false) { // Pour ne pas pouvoir appuyer sur les touches si game over
			var e = event.keyCode;
			if (e == 38) {Vaisseau.yVaisseau -= 10;};
			if (e == 40) {Vaisseau.yVaisseau += 10;};
			if (e == 37) {Vaisseau.xVaisseau -= 10;};
			if (e == 39) {Vaisseau.xVaisseau += 10;}
			if (e == 32) {Balles.push({xBalle : Vaisseau.xVaisseau , yBalle : Vaisseau.yVaisseau - 25, yBalleDepart : Vaisseau.yVaisseau - 25, VitesseBalle : 3.5})}
		}
	})
	
	var Ennemis = [];
	for (let j = 200; j > -4800; j -= 100){ // 200 -> -4800 = 5000; 6 vaisseaux tous les 100;  50 * 6 = 300 vaisseaux
		for(let k = 10; k < canvas.width ; k += 100){
			var random = Math.random()
			random *= 50 // Pour ne pas que tous les vaisseaux soient alignés horizontalement dans la rangée
			if (j <= 0){var entreeBool = false }
			else {var entreeBool = true}
			if (k <= canvas.width/2) {var Valdx = -1.25}
			else {var Valdx = 1.25}
			Ennemis.push({xEnnemi: k, yEnnemi: j + random, dx : Valdx, dy : 0.25, entree : entreeBool })
		}
	}
	var Vaisseau = {xVaisseau : 300, yVaisseau : 590, Score : 0}

	var Balles = []

	var Interval

	var animation = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawVaisseau(Vaisseau.xVaisseau, Vaisseau.yVaisseau);


		for (let a = 0; a < Balles.length; a ++){
			
			if (Balles[a] != false){
				Balles[a].yBalle -= Balles[a].VitesseBalle // avancement de la balle
				drawBalle(Balles[a].xBalle, Balles[a].yBalle )
				Balles[a].VitesseBalle = 0.99 * Balles[a].VitesseBalle // Ralentissement de la balle
				if (Balles[a].yBalleDepart - Balles[a].yBalle >= canvas.height/2){Balles[a] = false;} //durée de vie de la balle correspondant à la moitié de la hauteur du canvas
			}
		}
		
		for (let i = 0; i < Ennemis.length; i ++){
			if (Ennemis[i] != false){
				drawEnnemi(Ennemis[i].xEnnemi, Ennemis[i].yEnnemi)
				Ennemis[i].xEnnemi = Ennemis[i].xEnnemi + Ennemis[i].dx; Ennemis[i].yEnnemi = Ennemis[i].yEnnemi + Ennemis[i].dy; // Avancement des ennemis
				if (Ennemis[i].xEnnemi <= 0 || Ennemis[i].xEnnemi >= canvas.width - 50) { Ennemis[i].dx = -Ennemis[i].dx; } // Rebondissment des ennemis sur les cotés
				if ((Ennemis[i].yEnnemi <= 0 || Ennemis[i].yEnnemi >= canvas.height - 25) && Ennemis[i].entree == true) { if (Ennemis[i].dy < 0) {Ennemis[i].dy = - Ennemis[i].dy + ((10/100) * - Ennemis[i].dy);} else{Ennemis[i].dy = -Ennemis[i].dy - ((10/100)*Ennemis[i].dy) };} //Accélération des ennemis lorsqu'ils rebondissenent en haut ou en bas de l'écran
				if (Ennemis[i].yEnnemi > 0) {Ennemis[i].entree = true} // Entrée des vaisseaux dans l'écran
				if (Ennemis[i].yEnnemi <= Vaisseau.yVaisseau && Vaisseau.yVaisseau - 25 <= Ennemis[i].yEnnemi + 25 && Ennemis[i].xEnnemi <= Vaisseau.xVaisseau + 25 && Vaisseau.xVaisseau - 25 <= Ennemis[i].xEnnemi + 50) {Vaisseau = false;} // Collision de notre vaisseau avec celui des ennemis 
				for (let a = 0; a < Balles.length; a ++) {
					if (Ennemis[i].yEnnemi <=  Balles[a].yBalle && Balles[a].yBalle <= Ennemis[i].yEnnemi + 25 && Ennemis[i].xEnnemi <= Balles[a].xBalle && Balles[a].xBalle <= Ennemis[i].xEnnemi + 50 ) {Ennemis[i] = false; Balles[a] = false; Vaisseau.Score ++;} // Collision des balles avec les vaisseaux ennemis
					if (Balles[a].yBalle <= Vaisseau.yVaisseau && Vaisseau.yVaisseau - 25 <= Balles[a].yBalle && Balles[a].xBalle <= Vaisseau.xVaisseau + 25 && Vaisseau.xVaisseau - 25 <= Balles[a].xBalle) {Vaisseau = false;} // Collision des balles avec notre vaisseau
				}
			}
		}

		if (Vaisseau.xVaisseau + 25 >= canvas.width) {Vaisseau.xVaisseau = canvas.width - 25} //Pour ne pas que notre vaisseau puisse s'échapper
		if (Vaisseau.xVaisseau - 25 <= 0) {Vaisseau.xVaisseau = 25}
		if (Vaisseau.yVaisseau >= canvas.height) {Vaisseau.yVaisseau = canvas.height}
		if (Vaisseau.yVaisseau - 25 <= 0) {Vaisseau.yVaisseau = 25}
		context.fillStyle = "white"; context.font = "40px sans-serif"; context.fillText("Score : " + String(Vaisseau.Score), 10, 590); //Score
	
	Ennemis = arrayClearFalse(Ennemis) // On supprime tous les vaisseaux ennemis morts et les balles mortes
	Balles = arrayClearFalse(Balles)

	if (Vaisseau.Score == 300) {clearInterval(Interval); context.clearRect(0, 0, canvas.width, canvas.height); context.textAlign = 'center'; context.fillText("VICTOIRE", canvas.width/2, canvas.height/2);} // Victoire

	if (Vaisseau == false) {clearInterval(Interval); context.clearRect(0, 0, canvas.width, canvas.height); context.textAlign = 'center'; context.fillText("GAME OVER", canvas.width/2, canvas.height/2);} //Game Over
	
	}

	Interval = window.setInterval(animation, 10);
	
};
