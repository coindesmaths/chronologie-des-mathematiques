
function setLight() {
	document.querySelector('body').classList.add("light-theme");
	document.querySelector('body').classList.remove("dark-theme");
}

function setDark() {
	document.querySelector('body').classList.add("dark-theme");
	document.querySelector('body').classList.remove("light-theme");
}

let mm;
function registerMediaListener() {
	mm = window.matchMedia("(prefers-color-scheme: light)");
	mm.addEventListener('change', onLightSchemeChange);
}

function unregisterMediaListener() {
	if (mm) mm.removeListener(onLightSchemeChange);
}

function onLightSchemeChange(scheme) {
	console.log('onMediachange', scheme, scheme.matches);

	if (scheme.matches) {
		// We have browser/system light mode
		setLight();
	} else {
		setDark();
	}
}

function setMode() {
	// have a variable to indicate what mode
	// we should apply at the end of the procedure
	let lightMode;

	// always unregister media listener,
	// because we only need it if mode is not set,
	// which then we'll have to read media queries using matchMedia
	unregisterMediaListener();

	switch (localStorage.getItem("mode")) {
		case 'light-theme': {
			lightMode = true;
			document.querySelector('#clair').checked = true;
			setLight();
			break;
		}
		case 'dark-theme': {
			lightMode = false;
			document.querySelector('#sombre').checked = true;
			setDark();
			break;
		}
		default: { // using system setting
			document.querySelector('#auto').checked = true;
			// set lightMode indicator using the matchMedia query result
			lightMode = window.matchMedia("(prefers-color-scheme: light)").matches;
			// and register media change listener for changes
			registerMediaListener();
		}
	}

	// allpy new input values
	// let inputTheme = document.querySelector('input[name="theme"]');
	// if ("createEvent" in document) {
		// var evt = document.createEvent("HTMLEvents");
		// evt.initEvent("change", false, true);
		// inputTheme.dispatchEvent(evt);
	// }
	// else
		// inputTheme.fireEvent("onchange");

	// set the actual mode
	if (lightMode) {
		setLight();
	} else {
		setDark();
	}
}

window.addEventListener("load", (event) => {

	// Check the mode on load and style accordingly
	setMode();

	// add toggle
	document.querySelector('#clair').addEventListener("change", function() {
		localStorage.setItem("mode", "light-theme");
		setMode();
	});

	document.querySelector('#sombre').addEventListener("change", function() {
		localStorage.setItem("mode", "dark-theme");
		setMode();
	});

	document.querySelector('#auto').addEventListener("change", function() {
		localStorage.removeItem("mode");
		setMode();
	});
});
