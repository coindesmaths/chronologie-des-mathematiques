

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//					Gestion des données						//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

let periodesNonTerminees = [];
// Ajoute l'année courante comme année de fin
// pour les périodes non terminée
function gestionPeriodesNonTerminees(donneesJSON) {
	let anneeCourante = new Date().getFullYear();
	for (let periode of donneesJSON) {
		if (periode['End Year'] === null) {
			periode['End Year'] = anneeCourante;
			periodesNonTerminees.push(periode['Headline']);
		}
	}
}

// Organise et retourne les données des barres
// pour les empiler facilement
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//					Calculs de valeurs						//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//						Règles de dates						//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//			Construction des lignes de la frise				//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Construis un "frise-ligne" pour la frise chronologique
function construireLigneFrise() {
	
	let ligne = document.createElement('div');
	ligne.classList.add('frise-ligne');
	return ligne;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//			Construction des barres de périodes				//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//			Construction des points d'évènements			//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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
	point.donnees = evenement;
	
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//			Construction des blocs d'informations			//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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

// Construis un "info-fermer" pour un "info-contenu"
function construireInfoFermer(donnees) {
	
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
	
	return infoFermer;
}

function ecrireContenu(donnees) {
	contenu = donnees['Text'];
	// if (contenu !== '') return contenu
	
	// year = donnees['Year'];
	// end_year = donnees['End Year'];
	// nom = donnees['Headline'];
	// description = donnees['Text'];
	// urls = donnees['Articles URLs'];
	// sujets = donnees['Articles Sujets'];
	// media_thumbnail = donnees['Media'],
	// media_caption = donnees['Media Caption'];
	
	// if (donnees['end_year'] === '') {
		// mort += ` et mort(e) en ${end_year}`
	// }
	
	// contenu = `<p><b> ${prenom} ${nom}</b>, né(e) en ${year} ${mort}, est un(e) mathématicien(ne) reconnu(e).</p> ${description}`;
	return contenu;
}

// Construis un "info-contenu" pour un "info-flex"
function construireInfoContenu(donnees) {
	
	// Création d'un "info-contenu"
	let infoContenu = document.createElement('div');
	infoContenu.classList.add('info-contenu');
	
	// Création d'un "info-fermer"
	let infoFermer = construireInfoFermer(donnees);
	
	// Ajout d'éléments
	infoContenu.appendChild(infoFermer);
	let contenu = ecrireContenu(donnees);
	infoContenu.insertAdjacentHTML('beforeend', contenu);
	
	return infoContenu;
}

// Construis des liens pour un "info-flex"
function construireInfoLiens (donnees) {
	
	// Création d'un "info-liens"
	let infoLiens = document.createElement('div');
	infoLiens.classList.add('info-liens');
	
	// Ajout d'une règle horizontale
	infoLiens.insertAdjacentHTML('beforeend', '<hr/>');
	
	// Ajout des liens
	let liens = donnees['Articles URLs'].split(',');
	let sujets = donnees['Articles Sujets'].split(',');
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
	
	// Création d'un "info-wrapper"
	let infoWrapper = document.createElement('div');
	infoWrapper.classList.add('info-wrapper');
	
	// Création d'un "info-flex"
	let infoFlex = construireInfoFlex(donnees);
	
	// Ajout d'éléments
	infoModal.appendChild(infoWrapper);
	infoWrapper.appendChild(infoFlex);
	
	// Ajout d'un "info-liens"
	if (donnees['Articles URLs']) {
		let infoLiens = construireInfoLiens(donnees);
		infoWrapper.appendChild(infoLiens);
	}
	
	return infoModal;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//						Gestion du zoom						//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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
	for (let regle of regles) {
		let posX = anneeVersPositionX(regle.date);
		regle.style.left = `${posX}em`;
	}
	
	// Position et longueur des périodes
	let barres = document.getElementsByClassName('periode-barre');
	for (let barre of barres) {
		let annee1 = barre.donnees['Year'];
		let annee2 = barre.donnees['End Year'];
		let posX = anneeVersPositionX(annee1);
		let longueur = calculerLongueurBarre(annee1, annee2);
		barre.style.left = `${posX}em`;
		barre.style.width = longueur;
	}
	
	// Position des évènements
	let points = document.getElementsByClassName('evenement-point');
	for (let point of points) {
		let annee = point.donnees['Year'];
		let posX = anneeVersPositionX(annee);
		point.style.left = `${posX}em`;
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//			(Dés)affichage des blocs d'informations			//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//			(Dés)affichage des bulles d'évènements			//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
//						Gestion du hash						//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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