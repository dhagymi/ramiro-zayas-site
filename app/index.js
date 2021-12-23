import { each } from "lodash";

import Concerts from "pages/Concerts/index.js";
import Home from "pages/Home/index.js";
import Contact from "pages/Contact/index.js";
import Gallery from "pages/Gallery/index.js";
import Music from "pages/Music/index.js";

import Preloader from "components/Preloader.js";
import Header from "components/Header.js";
import ResponsiveNavBar from "components/ResponsiveNavBar.js";
import Footer from "components/Footer.js";
import ScrollBar from "components/ScrollBar.js";
import Options from "components/Options.js";

class App {
	constructor() {
		this.createContent();

		this.createPreloader();
		this.createFooter();
		this.createResponsiveNavBar();
		this.createHeader();
		this.createScrollBar();
		this.createOptions();
		this.createPages();
		this.createTitle();

		this.addEventListeners();
		this.addLinkListeners();

		this.update();
	}

	/* Creates */

	createPreloader() {
		this.preloader = new Preloader();
		this.preloader.once("completed", this.onPreloaded.bind(this));
	}

	createHeader() {
		this.header = new Header({
			template: this.template,
			interactionComponents: { responsiveNavBar: this.responsiveNavBar },
		});
		this.header.create();
	}

	createResponsiveNavBar() {
		this.responsiveNavBar = new ResponsiveNavBar({
			template: this.template,
		});
	}

	createFooter() {
		this.footer = new Footer({ template: this.template });
		this.footer.create();
	}

	createScrollBar() {
		this.scrollBar = new ScrollBar();
		this.scrollBar.create();
	}

	createOptions() {
		this.options = new Options();
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

	createTitle() {
		this.title = document.querySelector("title");
		this.title.innerText = `Ramiro Zayas | ${this.page.title}`;
	}

	/* Links */

	addLinkListeners() {
		this.links = document.querySelectorAll("a");
		this.boundedLinkCallback = this.linkListenersCallback.bind(this);

		each(this.links, (link) => {
			link.addEventListener("click", this.boundedLinkCallback);
		});
	}

	removeLinkListeners() {
		each(this.links, (link) => {
			link.removeEventListener("click", this.boundedLinkCallback);
		});
	}

	linkListenersCallback(event) {
		let link;
		if (!(event.target instanceof window.HTMLAnchorElement)) {
			link = event.target.parentNode;
			while (!(link instanceof window.HTMLAnchorElement)) {
				link = link.parentNode;
			}
		} else {
			link = event.target;
		}

		const { href: url } = link;
		const location = url.split("/")[url.split("/").length - 1];
		event.preventDefault();

		if (
			location !== this.template &&
			!(location.trim() === "" && this.template === "home")
		) {
			this.onChange({ url });
		}
	}

	/* Loop */
	update() {
		if (this.page && this.page.update) {
			this.page.update();
		}

		if (this.header && this.header.update) {
			this.header.update(this.page.showed || false);
		}

		if (this.footer && this.footer.update) {
			this.footer.update(this.page.showed || false);
		}

		if (this.scrollBar && this.scrollBar.update) {
			this.scrollBar.update(this.page.showed || false);
		}

		if (this.options && this.options.update) {
			this.options.update(false);
		}

		this.frame = window.requestAnimationFrame(this.update.bind(this));
	}

	/* Events */
	async onChange({ url, push = true }) {
		this.removeLinkListeners();
		this.page.hide();

		const request = await fetch(url);

		if (request.status === 200) {
			const html = await request.text();
			const div = document.createElement("div");

			if (push) {
				window.history.pushState({}, "", url);
			}

			div.innerHTML = html;

			const divContent = div.querySelector(".content");

			this.template = divContent.getAttribute("data-template");

			this.header.onChange(this.template);
			this.responsiveNavBar.onChange(this.template);
			this.footer.onChange(this.template);

			this.content.setAttribute("data-template", this.template);
			this.content.innerHTML = divContent.innerHTML;

			this.page = this.pages[this.template];
			this.page.create();
			this.createTitle();

			this.onResize();

			this.page.show();

			this.addLinkListeners();
		} else {
			console.log("Error");
		}
	}

	onPopState() {
		this.onChange({ url: window.location.pathname, push: false });
	}

	onPreloaded() {
		this.preloader.destroy();

		this.onResize();

		this.page.show();
	}

	onResize() {
		if (this.page && this.page.onResize) {
			this.page.onResize();
			this.header.onResize(this.page.elements.wrapper);
			this.footer.onResize(this.page.elements.wrapper);
			this.scrollBar.onResize(this.page.elements.wrapper);
		}
	}

	/* Listeners */

	addEventListeners() {
		window.addEventListener("popstate", this.onPopState.bind(this));
		window.addEventListener("resize", this.onResize.bind(this));
	}
}

new App();
