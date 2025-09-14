
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

const DATA_PERIODES = DATA['periodes'];
const DATA_EVENEMENTS = DATA['evenements'];

const IMG_COINDESMATHS = 'assets/coindesmaths.png';
const IMG_CROIX = 'assets/croix.svg';
const IMG_ZOOM_PLUS = 'assets/zoom-plus.svg';
const IMG_ZOOM_MOINS = 'assets/zoom-moins.svg';
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

let periodesNonTerminees = [];
// Ajoute l'année courante comme année de fin pour les périodes non terminée
function gestionPeriodesNonTerminees(donneesJSON) {
	let anneeCourante = new Date().getFullYear();
	for (let periode of donneesJSON) {
		if (periode['End Year'] === null) {
			periode['End Year'] = anneeCourante;
			periodesNonTerminees.push(periode['Headline']);
		}
	}
}

// Organise et retourne les données des barres pour les empiler facilement
function organiserDonneesJSON(donneesJSON) {
	
	// Initialisation des données
	let donnees = [];
	
	// Boucle sur les périodes dans les données
	for (let periode of donneesJSON) {
		
		// Recherche de la première ligne pouvant afficher sans superposer
		let annee = periode['Year'];
		let j = donnees.findIndex(d => annee > d.at(-1)['End Year'] + 1);
		
		// Distinction si la recherche a trouvé quelque chose
		if (j < 0) {
			// Si une ligne est disponible, ajout de la période
			donnees.push([periode]);
		}
		else {
			//Sinon, création d'une nouvelle ligne
			donnees[j].push(periode);
		}
	}
	return donnees;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Calcule la position horizontale à partir de l'année
function anneeVersPositionX(annee) {
	
	let posX = (-1000 <= annee) ? 2 * annee + 2200 : (annee + 5000) / 20;
	return 1.25 + zoom * 0.1 * (posX);
}

// Calcule la largeur de la barre à partir de ses années
function calculerLongueurBarre(annee1, annee2) {
	
	let posX1 = anneeVersPositionX(annee1);
	let posX2 = anneeVersPositionX(annee2);
	return `${posX2 - posX1}em`;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Crée une règle de date
function construireRegleDate(date) {
	
	// Création d'une nouvelle règle
	let regle = document.createElement('div');
	let posX = anneeVersPositionX(date);
	regle.classList.add('regle-date');
	regle.style.left = `${posX}em`;
	regle.date = date;
	
	// Distinction selon l'importance de la règle
	if (DATES_BOLD.includes(date)) {
		
		// Si la date est BOLD, ajouter la date dans un span
		let dateSpan = document.createElement('span');
		dateSpan.classList.add('date-span');
		dateSpan.textContent = date;
		regle.appendChild(dateSpan);
	} 
	else {
		
		// Sinon, c'est une règle claire
		regle.classList.add('clair');
	}
	
	return regle;
}

// Crée toutes les règles de dates
function construireReglesDates() {
	
	// Récupération de la ligne de dates
	let friseGraduation = document.getElementById('frise-graduation');
	
	// Création de toutes les dates
	for (let i = 0; i < DATES_LIGHT.length; i++) {
		
		// Création d'une nouvelle règle
		let date = DATES_LIGHT[i];
		let regle = construireRegleDate(date);
		
		// Ajout de la règle
		friseGraduation.appendChild(regle);
	}
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Construis un "frise-ligne" pour la frise chronologique
function construireLigneFrise() {
	
	let ligne = document.createElement('div');
	ligne.classList.add('frise-ligne');
	return ligne;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Construis un "periode-date" pour un "periode-lien"
function construirePeriodeDate(donnees) {
	
	let date = document.createElement('span');
	let annee1 = donnees['Year'];
	let annee2 = donnees['End Year'];
	date.classList.add("periode-date");
	date.textContent = ` (${annee1}-${annee2})`;
	return date;
}

// Construis un "periode-lien" pour un "periode-barre"
function construirePeriodeLien(donnees) {
	
	let lien = document.createElement('a');
	let titre = donnees['Headline'];
	lien.classList.add("periode-lien");
	lien.textContent = titre;
	lien.href = 'javascript:void(0);';
	lien.title = `Ouvrir la biographie de ${titre}`;
	lien.addEventListener('click', () => afficherInfoBloc(titre));
	return lien;
}

// Construis un "periode-barre" pour la frise chronologique
function construirePeriodeBarre(donnees) {
	
	// Construire "periode-barre"
	let barre = document.createElement('div');
	let annee1 = donnees['Year'];
	let annee2 = donnees['End Year'];
	let titre = donnees['Headline'];
	let posX = anneeVersPositionX(annee1);
	let longueur = calculerLongueurBarre(annee1, annee2);
	barre.classList.add("periode-barre");
	barre.style.left = `${posX}em`;
	barre.style.width = longueur;
	barre.donnees = donnees;
	barre.setAttribute("id", `barre:${titre}`);
	if (periodesNonTerminees.includes(titre)) barre.classList.add('en-vie');
	
	// Construire "periode-lien" et "date"
	let lien = construirePeriodeLien(donnees);
	// let date = construirePeriodeDate(donnees);
	
	// Ajout d'éléments
	// lien.appendChild(date);
	barre.appendChild(lien);
	
	return barre;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

function construireEvenementBulle(evenement) {
	
	let bulle = document.createElement('a');
	let titre = evenement['Headline'];
	bulle.classList.add('evenement-bulle');
	bulle.textContent = titre;
	
	bulle.href = 'javascript:void(0);';
	bulle.title = `Ouvrir la description de ${titre}`;
	bulle.addEventListener('click', () => afficherInfoBloc(titre));
	
	return bulle;
}

function construireEvenementPoint(evenement) {
	
	// Création d'un ... (disque)
	let point = document.createElement('div');
	let annee = evenement['Year'];
	let titre = evenement['Headline'];
	let posX = anneeVersPositionX(annee);
	point.classList.add('evenement-point');
	point.setAttribute("id", `point:${titre}`);
	point.style.left = `${posX}em`;
	
	// Création d'un "evenement-bulle" (bulle)
	let bulle = construireEvenementBulle(evenement);
	point.appendChild(bulle)
	
	// Listeners
	point.addEventListener('mouseenter', 
		(event) => afficherEvenementBulle(titre)
	);
	point.addEventListener('mouseleave', 
		(event) => fermerEvenementBulle(titre)
	);
	
	return point;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Construis un "info-photo-bloc" pour un "info-flex"
function construireInfoPhotoBloc(donnees) {
	
	// Création d'un "info-photo-bloc"
	let infoPhotoBloc = document.createElement('div');
	infoPhotoBloc.classList.add('info-photo-bloc');
	
	// Création d'un "info-photo"
	let infoPhoto = document.createElement('img');
	infoPhoto.classList.add('info-photo');
	infoPhoto.src = donnees['Media'];
	infoPhoto.loading = 'lazy';
	
	// Ajout d'éléments
	infoPhotoBloc.appendChild(infoPhoto);
	infoPhotoBloc.innerHTML += donnees['Media Caption'];
	
	return infoPhotoBloc;
}

// Construis un "info-contenu" pour un "info-flex"
function construireInfoContenu(donnees) {
	
	// Création d'un "info-contenu"
	let infoContenu = document.createElement('div');
	infoContenu.classList.add('info-contenu');
	
	// Création d'un "info-fermer"
	let infoFermer = document.createElement('a');
	let titre = donnees['Headline'];
	infoFermer.classList.add("info-fermer");
	infoFermer.href = 'javascript:void(0);';
	infoFermer.title = 'Fermer la biographie';
	infoFermer.addEventListener('click', () => fermerInfoBloc(titre));

	// Ajout d'une image à "info-fermer"
	let infoFermerImg = document.createElement('img');
	infoFermerImg.src = IMG_CROIX;
	infoFermer.appendChild(infoFermerImg);
	
	// Ajout d'éléments
	infoContenu.appendChild(infoFermer);
	infoContenu.insertAdjacentHTML('beforeend', donnees['Text']);
	
	return infoContenu;
}

// Construis des liens pour un "info-flex"
function construireInfoLiens (donnees) {
	
	// Création d'un "info-liens"
	let infoLiens = document.createElement('div');
	infoLiens.classList.add('info-liens');
	
	// Ajout d'une règle horizontale
	infoLiens.insertAdjacentHTML('beforeend', '<hr style="margin-top: 15px;">');
	
	// Ajout des liens
	let liens = donnees['Articles URLs'].split(',');
	let sujets = donnees['Articles Sujets'].split(',');
	console.log(donnees['Headline'], liens, sujets);
	for (let i = 0; i < liens.length; i++) {
		let lien = document.createElement('a');
		lien.classList.add('info-lien');
		lien.href = liens[i];
		lien.innerHTML = sujets[i];
		lien.target = '_blank';
		infoLiens.appendChild(lien);
	}
	
	return infoLiens;
}

// Construis un "info-flex" pour un "info-bloc"
function construireInfoFlex (donnees) {
	
	// Création d'un "info-flex"
	let infoFlex = document.createElement('div');
	infoFlex.classList.add('info-flex');
	
	// Création d'un "info-photo-bloc" et "info-contenu"
	let infoPhotoBloc = construireInfoPhotoBloc(donnees);
	let infoContenu = construireInfoContenu(donnees);
	
	// Ajout d'éléments
	infoFlex.appendChild(infoPhotoBloc);
	infoFlex.appendChild(infoContenu);
	
	return infoFlex;
}

// Construit un "info-modal" pour la frise chronologique
function construireInfoBloc(donnees) {
	
	// Création d'un "info-modal"
	let infoModal = document.createElement('dialog');
	let titre = donnees['Headline'];
	infoModal.method = 'dialog';
	infoModal.classList.add('info-modal');
	infoModal.setAttribute("id", donnees['Headline']);
	
	// Création d'un "info-flex"
	let infoFlex = construireInfoFlex(donnees);
	
	// Ajout d'éléments
	infoModal.appendChild(infoFlex);
	
	// Ajout d'un "info-liens"
	if (donnees['Articles URLs']) {
		let infoLiens = construireInfoLiens(donnees);
		infoModal.appendChild(infoLiens);
	}
	
	return infoModal;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

let zoom = 1;

function appliquerFacteurScroll(a) {
	let posXL = frise.scrollLeft;
	let posXC = posXL + window.innerWidth / 2;
	let newPosXC = a * posXC;
	let newPosXL = newPosXC - window.innerWidth / 2;
	frise.scrollTo(newPosXL, 0);
}

// Calcule les positions des règles et des barres
function calculerPositions() {
	
	// Position des règles
	let regles = document.getElementsByClassName('regle-date');
	for (regle of regles) {
		let posX = anneeVersPositionX(regle.date);
		regle.style.left = `${posX}em`;
	}
	
	// Position et longueur des barres
	barres = document.getElementsByClassName('periode-barre');
	for (barre of barres) {
		let annee1 = barre.donnees['Year'];
		let annee2 = barre.donnees['End Year'];
		let posX = anneeVersPositionX(annee1);
		let longueur = calculerLongueurBarre(annee1, annee2);
		barre.style.left = `${posX}em`;
		barre.style.width = longueur;
	}
}

// Vérifie l'affichage des dates en fonction du zoom
function verifierAffichageDates() {
	let dates = document.getElementsByClassName('periode-date');
	for (date of dates) {
		date.style.display = zoom < 1 ? 'none' : 'inline';
	}
}

function zoomer() {
	if (zoom < 2) {
		zoom *= 2;
		calculerPositions(zoom);
		appliquerFacteurScroll(2, 0);
		verifierAffichageDates();
	}
}

function dezoomer() {
	if (0.25 < zoom) {
		zoom /= 2;
		appliquerFacteurScroll(0.5, 0);
		calculerPositions();
		verifierAffichageDates();
	}
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Affiche un bloc info
function afficherInfoBloc(id) {
	let infoBloc = document.getElementById(id);
	infoBloc.showModal();
	setHash(`#${id}`);
}

// Fermer un bloc info
function fermerInfoBloc(id) {
	let infoBloc = document.getElementById(id);
	infoBloc.close();
	setHash('');
}

// Affiche une bulle d'évènement
function afficherEvenementBulle (id) {
	let evenement = document.getElementById(`point:${id}`);
	let bulle = evenement.getElementsByClassName('evenement-bulle')[0];
	bulle.classList.add('ouverte');
}

// Ferme une bulle d'évènement
function fermerEvenementBulle (id) {
	let evenement = document.getElementById(`point:${id}`);
	let bulle = evenement.getElementsByClassName('evenement-bulle')[0];
	bulle.classList.remove('ouverte');
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

function setHash (hash) { 
    var scrollV, scrollH, loc = window.location;
    if ("pushState" in history) {
		if (hash) {
			history.pushState(null, null, hash);
		} else {
			history.pushState("", document.title, window.location.pathname
                                                       + window.location.search);
		}
    } else {
		
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;

        loc.hash = hash;

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
    }
}

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