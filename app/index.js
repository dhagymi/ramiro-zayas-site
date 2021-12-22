import NormalizeWheel from "normalize-wheel";
import { each, iteratee } from "lodash";

import Concerts from "pages/Concerts/index.js";
import Home from "pages/Home/index.js";
import Contact from "pages/Contact/index.js";
import Gallery from "pages/Gallery/index.js";
import Music from "pages/Music/index.js";
import Preloader from "components/Preloader.js";

import StorageManager from "./classes/StorageManager.js";

import { lerp } from "./utils/math.js";

class App {
	constructor() {
		this.currentTheme = StorageManager.getTheme() || "light";

		this.createPreloader();
		this.createContent();
		this.createPages();
		this.createThemeContext();
		this.createMenuContext();

		this.addEventListeners();
		this.addLinkListeners();

		this.update();
	}

	createPreloader() {
		this.preloader = new Preloader();
		this.preloader.once("completed", this.onPreloaded.bind(this));
	}

	createContent() {
		this.content = document.querySelector(".content");
		this.template = this.content.getAttribute("data-template");
	}
	createPages() {
		this.pages = {
			home: new Home(),
			music: new Music(),
			concerts: new Concerts(),
			contact: new Contact(),
			gallery: new Gallery(),
		};

		this.page = this.pages[this.template];
		this.page.create();
	}

	addLinkListeners() {
		const links = document.querySelectorAll("a");

		each(links, (link) => {
			link.addEventListener("click", (event) => {
				const { href } = link;
				const location = href.split("/")[href.split("/").length - 1];
				event.preventDefault();

				if (
					location !== this.template &&
					!(location.trim() === "" && this.template === "home")
				) {
					this.onChange(href);
				}
			});
		});
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
	/* Loop */
	update() {
		if (this.page && this.page.update) {
			this.page.update();
		}

		this.frame = window.requestAnimationFrame(this.update.bind(this));
	}

	/* Events */
	async onChange(href) {
		this.page.hide();

		const request = await fetch(href);

		if (request.status === 200) {
			const html = await request.text();
			const div = document.createElement("div");

			div.innerHTML = html;

			const divContent = div.querySelector(".content");

			this.template = divContent.getAttribute("data-template");

			this.content.setAttribute("data-template", this.template);
			this.content.innerHTML = divContent.innerHTML;

			this.page = this.pages[this.template];
			this.page.create();

			this.onResize();

			this.page.show();

			this.addLinkListeners();
		} else {
			console.log("Error");
		}
	}

	onPreloaded() {
		this.preloader.destroy();

		this.onResize();

		this.page.show();
	}

	onResize() {
		if (this.page && this.page.onResize) {
			this.page.onResize();
		}
	}

	/* Listeners */

	addEventListeners() {
		window.addEventListener("resize", this.onResize.bind(this));
	}
}

new App();
