
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

const DATA_PERIODES = DATA['periodes'];
const DATA_EVENEMENTS = DATA['evenements'];

const IMG_COINDESMATHS = 'assets/coindesmaths.webp';
const IMG_CROIX = 'assets/croix.svg';
const IMG_ZOOM_PLUS = 'assets/zoom-plus.svg';
const IMG_ZOOM_MOINS = 'assets/zoom-moins.svg';
const IMG_OUTILS = 'assets/outils.svg';
const IMG_INFO = 'assets/info.svg';

const DATES_BOLD = [
	-5000,	-1000,	- 900,	- 800,	- 700,
	- 600,	- 500,	- 400,	- 300,	- 200,
	- 100,	    0,	  100,	  200,	  300,	
	  400,	  500,	  600,	  700,	  800,	
	  900,	 1000,	 1100,	 1200,	 1300,	
	 1400,	 1500,	 1600,	 1700,	 1800,	
	 1900,	 2000
];

const DATES_LIGHT = [
	-5000,	-4000,	-3000,	-2000,	
	-1000,	- 980,	- 960,	- 940,	- 920,	
	- 900,	- 880,	- 860,	- 840,	- 820,	
	- 800,	- 780,	- 760,	- 740,	- 720,	
	- 700,	- 680,	- 660,	- 640,	- 620,	
	- 600,	- 580,	- 560,	- 540,	- 520,	
	- 500,	- 480,	- 460,	- 440,	- 420,	
	- 400,	- 380,	- 360,	- 340,	- 320,	
	- 300,	- 280,	- 260,	- 240,	- 220,	
	- 200,	- 180,	- 160,	- 140,	- 120,	
	- 100,	-  80,	-  60,	-  40,	-  20,	
	    0,	   20,	   40,	   60,	   80,	
	  100,	  120,	  140,	  160,	  180,	
	  200,	  220,	  240,	  260,	  280,	
	  300,	  320,	  340,	  360,	  380,	
	  400,	  420,	  440,	  460,	  480,	
	  500,	  520,	  540,	  560,	  580,	
	  600, 	  620,	  640,	  660,	  680,	
	  700,	  720,	  740,	  760,	  780,	
	  800,	  820,	  840,	  860,	  880,	
	  900,	  920,	  940, 	  960,	  980,	
	 1000,	 1020,	 1040,	 1060,   1080,	
	 1100,	 1120,	 1140,	 1160,	 1180,	
	 1200,	 1220,	 1240,	 1260,	 1280,	
	 1300,	 1320,	 1340,	 1360,	 1380,	
	 1400,	 1420,	 1440,	 1460,	 1480,	
	 1500,	 1520,	 1540,	 1560,	 1580,	
	 1600,	 1620,	 1640,	 1660,	 1680,	
	 1700,	 1720,	 1740,	 1760,	 1780,	
	 1800,	 1820,	 1840,	 1860,	 1880,	
	 1900,	 1920,	 1940,	 1960,	 1980,	
	 2000,	 2020
];

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

window.addEventListener("load", (event) => {
	
	let periodesNonTerminees = gestionPeriodesNonTerminees(DATA_PERIODES);
	
	// Organisation des données
	let donnees = organiserDonneesJSON(DATA_PERIODES);
	console.log(donnees);

	// Création de la graduation de la frise chronologique
	construireReglesDates();

	// Création de toutes les barres de périodes
	let frisePeriodes = document.getElementById('frise-periodes');
	for (let i = 0; i < donnees.length; i++) {
		let ligne = construireLigneFrise();
		for (let periode of donnees[i]) {
			let barre = construirePeriodeBarre(periode);
			ligne.appendChild(barre);
		}
		frisePeriodes.appendChild(ligne);
	}
	
	// Création de tous les points d'évènements
	let friseEvenements = document.getElementById('frise-evenements');
	let friseLigneEvenements = friseEvenements.getElementsByClassName('frise-ligne');
	for (let evenement of DATA_EVENEMENTS) {
		let point = construireEvenementPoint(evenement);
		friseLigneEvenements[0].appendChild(point);
	}

	// Création de toutes les "info-bloc"
	let friseInfos = document.getElementById('frise-infos');
	for (let periode of DATA_PERIODES) {
		let infoBloc = construireInfoBloc(periode);
		friseInfos.appendChild(infoBloc);
	}
	for (let evenement of DATA_EVENEMENTS) {
		let infoBloc = construireInfoBloc(evenement);
		friseInfos.appendChild(infoBloc);
	}

	// Ajout listeners aux outils
	let outilZoom = document.getElementById('outil-zoom');
	outilZoom.addEventListener('click', zoomer);
	let outilDezoom = document.getElementById('outil-dezoom');
	outilDezoom.addEventListener('click', dezoomer);
	
	let outilInfo = document.getElementById('outil-info');
	outilInfo.addEventListener('click', () => afficherInfoBloc('informations'));
	let info = document.getElementById('informations');
	let infoFermer = info.getElementsByClassName('info-fermer')[0];
	infoFermer.addEventListener('click', () => fermerInfoBloc('informations'));
	
	// Commencer tout à droite
	let frise = document.getElementById('frise');
	frise.scrollTo(frise.scrollWidth, 0);

	// Gestion du hash
	let hash = window.location.hash.slice(1);
	if (document.getElementById(hash)) {
		afficherInfoBloc(hash);
	} else {
		setHash('');
	}
});