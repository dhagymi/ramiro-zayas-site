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
		this.isVisible = true;

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
				this.isVisible &&
				this.rects?.toHover.top - this.rects?.element.bottom < 40 &&
				this.rects?.element.top - this.rects?.toHover.bottom < 40
			) {
				this.hideElement(this.element);
				this.isVisible = false;
			} else if (
				!this.isVisible &&
				(this.rects?.toHover.top - this.rects?.element.bottom > 40 ||
					this.rects?.element.top - this.rects?.toHover.bottom > 40)
			) {
				this.showElement(this.element);
				this.isVisible = true;
			}
		}
	}

	/* Animations */

	showElement(elements) {
		return new Promise((resolve) => {
			if (Array.isArray(elements)) {
				elements.forEach((element) => {
					this.timeline = GSAP.timeline();
					this.timeline.to(element, {
						autoAlpha: 1,
						onComplete: resolve,
					});
				});
			} else {
				this.timeline = GSAP.timeline();
				this.timeline.to(elements, {
					autoAlpha: 1,
					onComplete: resolve,
				});
			}
		});
	}

	hideElement(elements) {
		return new Promise((resolve) => {
			if (Array.isArray(elements)) {
				elements.forEach((element) => {
					this.timeline = GSAP.timeline();
					this.timeline.to(element, { autoAlpha: 0, onComplete: resolve });
				});
			} else {
				this.timeline = GSAP.timeline();
				this.timeline.to(elements, { autoAlpha: 0, onComplete: resolve });
			}
		});
	}
}
