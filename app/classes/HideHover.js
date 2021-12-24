import GSAP from "gsap";

import Component from "classes/Component.js";

export default class HideHover extends Component {
	constructor({ element, generalComponents }) {
		super({ element, generalComponents });

		this.toHoverSelector = generalComponents.toHover;

		this.create();
	}

	create() {
		super.create();

		this.rects = {};

		this.toHoverComponent = this.generalComponents.toHover;

		if (this.toHoverComponent instanceof HTMLElement) {
			this.createRects();
		}
	}

	createRects() {
		this.rects.toHover = this.toHoverComponent.getBoundingClientRect();

		this.rects.element = this.element.getBoundingClientRect();
	}

	update() {
		if (this.toHoverComponent instanceof HTMLElement) {
			this.toHoverComponent = document.querySelector(this.toHoverSelector);
			this.createRects();

			if (
				this.element.style.opacity != 0 &&
				this.rects?.toHover.top - this.rects?.element.bottom < 25 &&
				this.rects?.element.top - this.rects?.toHover.bottom < 25
			) {
				this.hideElement(this.element);
			} else {
				this.showElement(this.element);
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
}
