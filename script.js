
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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

// Organise et retourne les données des barres pour les empiler facilement
function organiserDonneesJSON(donneesJSON)
{	
	// Initialisation des données
	let donnees = [];
	
	// Boucle sur les périodes dans les données
	for (let periode of donneesJSON)
	{
		// Recherche de la première ligne pouvant afficher sans superposer
		let annee = periode['Year'];
		let j = donnees.findIndex(d => annee > d.at(-1)['End Year']);
		
		// Distinction si la recherche a trouvé quelque chose
		if (j < 0)
		{
			// Si une ligne est disponible, ajout de la période
			donnees.push([periode]);
		}
		else
		{
			//Sinon, création d'une nouvelle ligne
			donnees[j].push(periode);
		}
	}
	return donnees;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Calcule la position horizontale à partir de l'année
function anneeVersPositionX(annee)
{
	let posX = (-1000 <= annee) ? 2 * annee + 2200 : (annee + 5000) / 20;
	return 1.25 + zoom * 0.1 * (posX);
}

// Calcule la largeur de la barre à partir de ses années
function calculerLongueurBarre(annee1, annee2)
{
	let posX1 = anneeVersPositionX(annee1);
	let posX2 = anneeVersPositionX(annee2);
	return `${posX2 - posX1}em`;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Crée une règle de date
function construireRegleDate(date)
{
	// Création d'une nouvelle règle
	let regle = document.createElement('div');
	let posX = anneeVersPositionX(date);
	regle.classList.add('regle-date');
	regle.style.left = `${posX}em`;
	regle.date = date;
	
	// Distinction selon l'importance de la règle
	if (DATES_BOLD.includes(date))
	{
		// Si la date est BOLD, ajouter la date dans un span
		let dateSpan = document.createElement('span');
		dateSpan.classList.add('date-span');
		dateSpan.textContent = date;
		regle.appendChild(dateSpan);
	} 
	else
	{
		// Sinon, c'est une règle claire
		regle.classList.add('clair');
	}
	
	return regle;
}

// Crée toutes les règles de dates
function construireReglesDates()
{
	// Récupération de la ligne de dates
	let friseGraduation = document.getElementById('frise-graduation');
	
	// Création de toutes les dates
	for (let i = 0; i < DATES_LIGHT.length; i++)
	{
		// Création d'une nouvelle règle
		let date = DATES_LIGHT[i];
		let regle = construireRegleDate(date);
		
		// Ajout de la règle
		friseGraduation.appendChild(regle);
	}
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Construis un "frise-ligne" pour la frise chronologique
function construireLigneFrise()
{
	let ligne = document.createElement('div');
	ligne.classList.add('frise-ligne');
	return ligne;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Construis un "periode-date" pour un "periode-lien"
function construirePeriodeDate(donnees)
{
	let date = document.createElement('span');
	let annee1 = donnees['Year'];
	let annee2 = donnees['End Year'];
	date.classList.add("periode-date");
	date.textContent = ` (${annee1}-${annee2})`;
	return date;
}

// Construis un "periode-lien" pour un "periode-barre"
function construirePeriodeLien(donnees)
{
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
function construirePeriodeBarre(donnees)
{
	// Construire "periode-barre"
	let barre = document.createElement('div');
	let annee1 = donnees['Year'];
	let annee2 = donnees['End Year'];
	let posX = anneeVersPositionX(annee1);
	let longueur = calculerLongueurBarre(annee1, annee2);
	barre.classList.add("periode-barre");
	barre.style.left = `${posX}em`;
	barre.style.width = longueur;
	barre.donnees = donnees;
	
	// Construire "periode-lien" et "date"
	let lien = construirePeriodeLien(donnees);
	let date = construirePeriodeDate(donnees);
	
	// Ajout d'éléments
	lien.appendChild(date);
	barre.appendChild(lien);
	
	return barre;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Construis un "info-photo-bloc" pour un "info-flex"
function construireInfoPhotoBloc(donnees)
{
	// Création d'un "info-photo-bloc"
	let infoPhotoBloc = document.createElement('div');
	infoPhotoBloc.classList.add('info-photo-bloc');
	
	// Création d'un "info-photo"
	let infoPhoto = document.createElement('img');
	infoPhoto.classList.add('info-photo');
	infoPhoto.src = donnees['Media'];
	
	// Ajout d'éléments
	infoPhotoBloc.appendChild(infoPhoto);
	infoPhotoBloc.innerHTML += donnees['Media Caption'];
	
	return infoPhotoBloc;
}

// Construis un "info-contenu" pour un "info-flex"
function construireInfoContenu(donnees)
{	
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
function construireInfoLiens (donnees)
{	
	// Création d'un "info-liens"
	let infoLiens = document.createElement('div');
	infoLiens.classList.add('info-liens');
	
	// Ajout d'une règle horizontale
	infoLiens.insertAdjacentHTML('beforeend', '<hr style="margin-top: 15px;">');
	
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
function construireInfoFlex (donnees)
{	
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
	
	// Créer "info-content"
	info_content = document.createElement('div');
	info_content.classList.add('info-content');
	
	// Créer "info-fermer"
	info_fermer = document.createElement('a');
	info_fermer.classList.add("info-fermer");
	info_fermer.href = 'javascript:void(0);';
	info_fermer.addEventListener('click', function () {
		info_fermer_onclick(donnees['Headline']);
	});
	
	// Ajouter image à "info-fermer"
	img = document.createElement('img')
	img.src = 'https://www.svgrepo.com/download/80301/cross.svg'
	info_fermer.appendChild(img);
	
	// Append childs
	info_photo_box.appendChild(info_photo);
	info_photo_box.innerHTML += donnees['Media Caption'];
	info_flex.appendChild(info_photo_box);
	info_content.appendChild(info_fermer);
	info_content.insertAdjacentHTML('beforeend', donnees['Text']);
	info_flex.appendChild(info_content);
	
	return info_flex;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

//	<div class="info-liens">
//		<hr style="margin-top: 15px;">
//		<a class="info-lien" href="https://coindesmaths.fr/somme-des-entiers-dsm1/">Somme des entiers</a>
//	</div>

function creer_info_liens (donnees) {
	
	// Créer "info-liens"
	info_liens = document.createElement('div');
	info_liens.classList.add('info-liens');
	
	// Ajouter règle horizontale
	info_liens.insertAdjacentHTML('beforeend', '<hr style="margin-top: 15px;">');
	
	// Ajouter liens
	liens = donnees['Articles URLs'].split(',');
	sujets = donnees['Articles Sujets'].split(',');
	for (let i = 0; i < liens.length; i++) {
		lien = document.createElement('a');
		lien.classList.add('info-lien');
		lien.href = liens[i];
		lien.innerHTML = sujets[i];
		lien.target = '_blank';
		info_liens.appendChild(lien);
	}
	
	return info_liens;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

const timeline_content = document.getElementById("timeline-content");

//console.log(max_posx + 'em');
// timeline_content.style.width = max_posx + 'em';

creer_regles_dates();

donnees = organiser_donnees(data);
console.log(donnees);

// Créer toutes les barres de mathématiciens
for (let i = 0; i < donnees.length; i++) {
	ligne = creer_timeline_ligne();
	for (const mathematicien of donnees[i]) {
		barre = creer_mathematicien_barre(mathematicien);
		ligne.appendChild(barre);
	}
	timeline_content.appendChild(ligne);
}

// Créer toutes les "info-bio"
for (const mathematicien of data) {
	info_bios = document.getElementById('timeline-bios');
	info_bio = creer_info_bio(mathematicien);
	info_bios.appendChild(info_bio);
}// Ajout listeners aux outils
let outilZoom = document.getElementById('outil-zoom');
outilZoom.addEventListener('click', zoomer);
let outilDezoom = document.getElementById('outil-dezoom');
outilDezoom.addEventListener('click', dezoomer);
let outilInfo = document.getElementById('outil-info');
outilInfo.addEventListener('click', () => afficherInfoBloc('informations'));
let informations = document.getElementById('informations');
informationsFermer = informations.getElementsByClassName('info-fermer')[0];
informationsFermer.addEventListener('click', () => fermerInfoBloc('informations'));

// Commencer tout à droite
let frise = document.getElementById('frise');
frise.scrollLeft = frise.scrollWidth;