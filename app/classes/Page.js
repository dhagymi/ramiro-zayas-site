import GSAP from "gsap";
import normalizeWheel from "normalize-wheel";
import prefix from "prefix";
import { each, map } from "lodash";

import Fade from "animations/Fade.js";

import AsyncLoad from "classes/AsyncLoad.js";

import { lerp, clamp } from "utils/math.js";

export default class Page {
	constructor({ id, element, elements, title }) {
		this.selector = element;
		this.selectorChildren = {
			...elements,

			animationsFades: '[data-animation="fade"]',

			preloaders: "[data-src]",
		};
		this.title = title;

		this.id = id;
		this.transformPrefix = prefix("transform");

		this.onMouseWheelEvent = this.onMouseWheel.bind(this);
		this.onTouchDownEvent = this.onTouchDown.bind(this);
		this.onTouchMoveEvent = this.onTouchMove.bind(this);
		this.onTouchUpEvent = this.onTouchUp.bind(this);
	}

	create() {
		this.element = document.querySelector(this.selector);
		this.elements = {};

		this.scroll = {
			ease: 0.1,
			current: 0,
			target: 0,
			limit: 0,
			last: 0,
		};

		this.y = {
			start: 0,
			difference: 0,
			end: 0,
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

		this.createAnimations();

		this.createPreloader();
	}

	createAnimations() {
		this.animationsFades = map(this.elements.animationsFades, (element) => {
			return new Fade({ element });
		});
	}

	createPreloader() {
		if (this.elements.preloaders?.length) {
			this.preloaders = map(this.elements.preloaders, (element) => {
				return new AsyncLoad({ element });
			});
		} else if (this.elements.preloaders) {
			this.preloaders = new AsyncLoad({ element: this.elements.preloaders });
		}
	}

	/* Animations */

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
				this.showed = true;

				resolve();
			});
		});
	}

	hide() {
		return new Promise((resolve) => {
			this.destroy();
			this.showed = false;

			this.animationOut = GSAP.timeline();

			this.animationOut.to(this.element, {
				autoAlpha: 0,
				onComplete: resolve,
			});
		});
	}

	/* Loops */

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

		if (this.elements.wrapper) {
			this.elements.wrapper.style[
				this.transformPrefix
			] = `translateY(-${this.scroll.current}px)`;
		}
	}

	/* Events */

	onMouseWheel(event) {
		const { pixelY } = normalizeWheel(event);

		this.scroll.target += pixelY;
	}

	onTouchDown(event) {
		this.isTouching = true;

		this.y.start = event.touches[0].clientY;
	}

	onTouchMove(event) {
		if (!this.isTouching) return;

		this.y.end = event.touches[0].clientY;

		this.y.difference = this.y.start - this.y.end;
		this.y.start = this.y.end;
		this.scroll.target += this.y.difference;
	}

	onTouchUp(event) {
		this.isTouching = false;

		this.y.end = event.changedTouches[0].clientY;

		this.y.difference = this.y.start - this.y.end;

		this.scroll.target += this.y.difference;
	}

	onResize() {
		if (this.elements.wrapper) {
			this.scroll.limit =
				this.elements.wrapper.clientHeight - window.innerHeight;
		}
	}

	/* Listeners */

	addEventListeners() {
		window.addEventListener("mousewheel", this.onMouseWheelEvent);
		window.addEventListener("touchstart", this.onTouchDownEvent);
		window.addEventListener("touchmove", this.onTouchMoveEvent);
		window.addEventListener("touchend", this.onTouchUpEvent);
	}

	removeEventListeners() {
		window.addEventListener("mousewheel", this.onMouseWheelEvent);
		window.addEventListener("touchstart", this.onTouchDownEvent);
		window.addEventListener("touchmove", this.onTouchMoveEvent);
		window.addEventListener("touchend", this.onTouchUpEvent);
	}

	/* Destroy */

	destroy() {
		this.removeEventListeners();
	}
}
