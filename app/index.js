import NormalizeWheel from "normalize-wheel";

import StorageManager from "./classes/StorageManager.js";

import { lerp } from "./utils/math.js";

class App {
	constructor() {
		this.scroll = {
			ease: 0.1,
			current: 0,
			target: 0,
		};
		this.currentTheme = StorageManager.getTheme() || "light";

		this.createThemeContext();
		this.createMenuContext();
		this.addEventListeners();
	}

	addEventListeners() {
		window.addEventListener("mousewheel", this.onWheel);
	}
	createMenuContext() {
		document.addEventListener("DOMContentLoaded", () => {
			const menuButton = document.querySelectorAll(".header__options__menu");
			const closeMenuButton = document.querySelectorAll(
				".navigationResponsive__subHeader__closeButton"
			);

			menuButton.forEach((button) =>
				button.addEventListener("click", this.menuButtonClickHandle)
			);

			closeMenuButton.forEach((button) =>
				button.addEventListener("click", this.menuButtonClickHandle)
			);
		});
	}

	createThemeContext() {
		document.addEventListener("DOMContentLoaded", () => {
			const html = document.querySelector("html");
			html.dataset.theme = `theme-${this.currentTheme}`;

			const darkThemeButton = document.querySelectorAll(".options__darkTheme");

			darkThemeButton.forEach((button) =>
				button.addEventListener("click", this.themeButtonClickHandle)
			);
		});
	}

	menuButtonClickHandle() {
		const responsiveNavBar = document.querySelector(".navigationResponsive");

		if (responsiveNavBar.classList.contains("navigationResponsive--active")) {
			responsiveNavBar.classList.remove("navigationResponsive--active");
		} else {
			responsiveNavBar.classList.add("navigationResponsive--active");
		}
	}

	themeButtonClickHandle() {
		const html = document.querySelector("html");

		this.currentTheme = this.currentTheme === "dark" ? "light" : "dark";
		localStorage.setItem("themeRZsite", this.currentTheme);
		html.dataset.theme = `theme-${this.currentTheme}`;
	}

	onWheel(event) {
		const header = document.querySelector("header");
		const main = document.querySelector("main");
		const footer = document.querySelector("footer");

		if (typeof this.scroll.current != "number") {
			this.scroll.current = 0;
			this.scroll.target = 0;
			this.scroll.ease = 0.5;
		}

		const normalized = NormalizeWheel(event);
		const speed = -normalized.pixelY;

		this.scroll.target += speed;

		const newScroll = lerp(
			this.scroll.current,
			this.scroll.target,
			this.scroll.ease
		);

		if (newScroll <= 0 && newScroll >= window.innerHeight - main.offsetHeight) {
			this.scroll.current = newScroll;
		} else if (newScroll > 0) {
			this.scroll.current = 0;
		} else if (newScroll < window.innerHeight - main.offsetHeight) {
			this.scroll.current = window.innerHeight - main.offsetHeight;
		}

		this.scroll.target = this.scroll.current;

		header.setAttribute(
			"style",
			`transform: translateY(${this.scroll.current}px)`
		);
		main.setAttribute(
			"style",
			`transform: translateY(${this.scroll.current}px)`
		);
		footer.setAttribute(
			"style",
			`transform: translateY(${this.scroll.current}px)`
		);
	}
}

new App();
