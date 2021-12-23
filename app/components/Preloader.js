import { each } from "lodash";
import GSAP from "gsap";

import Component from "classes/Component.js";

export default class Preloader extends Component {
	constructor() {
		super({
			element: ".preloader",
			elements: {
				number: ".preloader__number",
				images: document.querySelectorAll("img"),
				audios: document.querySelectorAll("audio"),
			},
		});

		this.create();

		this.length = 0;

		this.createLoader();
	}

	createLoader() {
		each(this.elements.images, (element) => {
			const image = new Image();
			image.addEventListener("load", () => this.onAssetLoaded());
			image.src = element.getAttribute("data-src");
		});

		each(this.elements.audios, (element) => {
			const audio = new Audio();
			audio.addEventListener("canplay", () => {
				this.onAssetLoaded();
			});
			audio.src = element.childNodes[0].getAttribute("data-src");
			audio.load();
		});
	}

	onAssetLoaded() {
		this.length += 1;

		this.charge =
			this.length / (this.elements.images.length + this.elements.audios.length);

		this.elements.number.innerHTML = `${Math.round(this.charge * 100)}%`;

		if (this.charge === 1) {
			this.onLoaded();
		}
	}

	onLoaded() {
		return new Promise((resolve) => {
			this.animateOut = GSAP.timeline({
				delay: 2,
			});

			this.animateOut.to(this.element, {
				autoAlpha: 0,
			});

			this.animateOut.call(() => {
				this.emit("completed");
			});
		});
	}

	destroy() {
		this.element.parentNode.removeChild(this.element);
	}
}
