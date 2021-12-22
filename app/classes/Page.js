import GSAP from "gsap";
import Prefix from "prefix";
import { each } from "lodash";

import { lerp, clamp } from "utils/math.js";

export default class Page {
	constructor({ id, element, elements }) {
		this.selector = element;
		this.selectorChildren = { ...elements };
		this.generalSelectors = {
			header: ".header",
			footer: ".footer",
			options: ".options",
			social: ".social",
		};

		this.id = id;
		this.transformPrefix = Prefix("transform");

		this.onMouseWheelEvent = this.onMouseWheel.bind(this);
	}

	create() {
		this.element = document.querySelector(this.selector);
		this.elements = {};
		this.generalComponents = {};

		this.scroll = {
			ease: 0.1,
			current: 0,
			target: 0,
			limit: 0,
		};

		each(this.selectorChildren, (selector, key) => {
			if (
				selector instanceof window.HTMLElement ||
				selector instanceof window.NodeList
			) {
				this.elements[key] = selector;
			} else if (Array.isArray(selector)) {
				this.elements[key] = selector;
			} else {
				this.elements[key] = this.element.querySelectorAll(selector);

				if (this.elements[key].length === 0) {
					this.elements[key] = null;
				} else if (this.elements[key].length === 1) {
					this.elements[key] = this.element.querySelector(selector);
				}
			}
		});

		each(this.generalSelectors, (selector, key) => {
			if (
				selector instanceof window.HTMLElement ||
				selector instanceof window.NodeList
			) {
				this.generalComponents[key] = selector;
			} else if (Array.isArray(selector)) {
				this.generalComponents[key] = selector;
			} else {
				this.generalComponents[key] = document.querySelectorAll(selector);

				if (this.generalComponents[key].length === 0) {
					this.generalComponents[key] = null;
				} else if (this.generalComponents[key].length === 1) {
					this.generalComponents[key] = document.querySelector(selector);
				}
			}
		});
	}

	show() {
		return new Promise((resolve) => {
			this.animationIn = GSAP.timeline();
			this.animationIn.fromTo(
				this.element,
				{ autoAlpha: 0 },
				{
					autoAlpha: 1,
				}
			);

			this.animationIn.call(() => {
				this.addEventListeners();

				resolve();
			});
		});
	}

	hide() {
		return new Promise((resolve) => {
			this.removeEventListeners();

			this.animationOut = GSAP.timeline();

			this.animationOut.to(this.element, {
				autoAlpha: 0,
				onComplete: resolve,
			});
		});
	}

	update() {
		this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target);

		if (
			lerp(this.scroll.current, this.scroll.target, this.scroll.ease) < 0.01
		) {
			this.scroll.current = 0;
		} else {
			this.scroll.current = lerp(
				this.scroll.current,
				this.scroll.target,
				this.scroll.ease
			);
		}

		if (
			this.elements.wrapper &&
			this.generalComponents.header &&
			this.generalComponents.footer
		) {
			this.elements.wrapper.style[
				this.transformPrefix
			] = `translateY(-${this.scroll.current}px)`;
			this.generalComponents.header.style[
				this.transformPrefix
			] = `translateY(-${this.scroll.current}px)`;
			this.generalComponents.footer.style[
				this.transformPrefix
			] = `translateY(-${this.scroll.current}px)`;
		}
	}

	onMouseWheel(event) {
		const { deltaY } = event;

		this.scroll.target += deltaY;
	}

	onResize() {
		if (this.elements.wrapper) {
			this.scroll.limit =
				this.elements.wrapper.clientHeight - window.innerHeight;
		}
	}

	addEventListeners() {
		window.addEventListener("mousewheel", this.onMouseWheelEvent);
	}

	removeEventListeners() {
		window.addEventListener("mousewheel", this.onMouseWheelEvent);
	}
}
