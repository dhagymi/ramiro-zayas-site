export default class StorageManger {
	constructor() {}

	static getTheme() {
		return localStorage.getItem("themeRZsite");
	}

	static setTheme(theme) {
		localStorage.setItem("themeRZsite", theme);
	}

	static getSound() {
		return localStorage.getItem("soundRZsite");
	}

	static setSound(sound) {
		localStorage.setItem("soundRZsite", sound);
	}
}
