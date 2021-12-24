import GSAP from "gsap";

import Component from "classes/Component.js";
import StorageManager from "classes/StorageManager.js";

import Audio from "components/Audio.js";

export default class Options extends Component {
	constructor() {
		super({
			element: ".options",
			elements: {},
			generalComponents: {
				html: "html",
				themeButton: ".options__darkTheme",
				themeNightIcon: ".options__darkTheme__icon--on",
				themeDayIcon: ".options__darkTheme__icon--off",
				themeNightText: ".options__darkTheme__text--on",
				themeDayText: ".options__darkTheme__text--off",
				soundButton: ".options__sound",
				soundPulses: ".options__sound__pulse",
				soundOnText: ".options__sound__text--on",
				soundOffText: ".options__sound__text--off",
				musicCardPrevious: ".music__videos__card--previous",
			},
		});

		this.currentTheme = StorageManager.getTheme() || "light";
		this.isSoundOn = StorageManager.getSound() ?? true;

		this.onThemeClickEvent = this.onThemeClick.bind(this);
		this.onSoundClickEvent = this.onSoundClick.bind(this);

		this.create();
	}

	/* Create */

	create() {
		super.create();
		this.audio = new Audio();
		this.audio.create();
		this.rects = {};

		if (this.currentTheme === "dark") {
			this.setNightTheme();
		} else {
			this.setDayTheme();
		}

		if (this.isSoundOn) {
			this.setSoundOn();
		} else {
			this.setSoundOff();
		}

		if (this.generalComponents.musicCardPrevious instanceof HTMLElement) {
			this.createRects();
		}
	}

	createRects() {
		this.rects.musicCardPrevious =
			this.generalComponents.musicCardPrevious.getBoundingClientRect();

		this.rects.themeButton =
			this.generalComponents.themeButton[0].getBoundingClientRect();
		this.rects.soundButton =
			this.generalComponents.soundButton[0].getBoundingClientRect();
	}

	update() {
		if (this.generalComponents.musicCardPrevious instanceof HTMLElement) {
			this.generalComponents.musicCardPrevious = document.querySelector(
				this.generalSelectors.musicCardPrevious
			);
			this.createRects();

			if (
				this.generalComponents.themeButton[0].style.opacity != 0 &&
				this.rects?.musicCardPrevious.top - this.rects?.themeButton.bottom <
					25 &&
				this.rects?.themeButton.top - this.rects?.musicCardPrevious.bottom < 25
			) {
				this.hideElement(this.generalComponents.themeButton[0]);
			} else {
				this.showElement(this.generalComponents.themeButton[0]);
			}

			if (
				this.generalComponents.soundButton[0].style.opacity != 0 &&
				this.rects?.musicCardPrevious.top - this.rects?.soundButton.bottom <
					25 &&
				this.rects?.soundButton.top - this.rects?.musicCardPrevious.bottom < 25
			) {
				this.hideElement(this.generalComponents.soundButton[0]);
			} else {
				this.showElement(this.generalComponents.soundButton[0]);
			}
		}
	}

	/* Animations */

	showElement(elements) {
		return new Promise((resolve) => {
			this.timeline = GSAP.timeline();
			if (Array.isArray(elements)) {
				elements.forEach((element) => {
					this.timeline.to(element, {
						autoAlpha: 1,
						onComplete: resolve,
					});
				});
			} else {
				this.timeline.to(elements, {
					autoAlpha: 1,
					onComplete: resolve,
				});
			}
		});
	}

	hideElement(elements) {
		return new Promise((resolve) => {
			this.timeline = GSAP.timeline();
			if (Array.isArray(elements)) {
				elements.forEach((element) => {
					this.timeline.to(element, { autoAlpha: 0, onComplete: resolve });
				});
			} else {
				this.timeline.to(elements, { autoAlpha: 0, onComplete: resolve });
			}
		});
	}

	animatePulses() {
		this.generalComponents.soundPulses.forEach((pulse) => {
			const index = pulse.className[pulse.className.length - 1];
			pulse.style["animation-name"] = `pulse${index}`;
		});
	}

	stopPulsesAnimation() {
		this.generalComponents.soundPulses.forEach((pulse, index) => {
			pulse.style["animation-name"] = ``;
		});
	}

	/* Interactions */

	setNightTheme() {
		this.showElement(this.generalComponents.themeNightIcon);
		this.showElement(this.generalComponents.themeNightText);
		this.hideElement(this.generalComponents.themeDayIcon);
		this.hideElement(this.generalComponents.themeDayText);
		this.generalComponents.html.dataset.theme = `theme-${this.currentTheme}`;
	}

	setDayTheme() {
		this.showElement(this.generalComponents.themeDayIcon);
		this.showElement(this.generalComponents.themeDayText);
		this.hideElement(this.generalComponents.themeNightIcon);
		this.hideElement(this.generalComponents.themeNightText);
		this.generalComponents.html.dataset.theme = `theme-${this.currentTheme}`;
	}

	setSoundOn() {
		if (this.audio.canPlay()) {
			this.onCanPlay();
		} else {
			this.setSoundOff();
		}
	}

	setSoundOff() {
		this.showElement(this.generalComponents.soundOffText);
		this.hideElement(this.generalComponents.soundOnText);
		this.audio.pause();
		this.stopPulsesAnimation();
	}

	changeTheme() {
		if (this.currentTheme === "dark") {
			this.currentTheme = "light";
			this.setDayTheme();
		} else {
			this.currentTheme = "dark";
			this.setNightTheme();
		}
	}

	switchSound() {
		if (this.isSoundOn) {
			this.isSoundOn = false;
			this.setSoundOff();
		} else {
			this.isSoundOn = true;
			this.setSoundOn();
		}
	}

	/* Events */

	onThemeClick() {
		this.changeTheme();
		StorageManager.setTheme(this.currentTheme);
	}

	onSoundClick() {
		this.switchSound();
		StorageManager.setSound(this.isSoundOn);
	}

	onCanPlay() {
		this.showElement(this.generalComponents.soundOnText);
		this.hideElement(this.generalComponents.soundOffText);
		this.audio.play();
		this.animatePulses();
	}

	/* Listeners */

	addEventListeners() {
		super.addEventListeners();

		this.generalComponents.themeButton.forEach((button) => {
			button.addEventListener("click", this.onThemeClickEvent);
		});

		this.generalComponents.soundButton.forEach((button) => {
			button.addEventListener("click", this.onSoundClickEvent);
		});
	}
}
