import GSAP from "gsap";

import Animation from "classes/Animation.js";

export default class Fade extends Animation {
	constructor({ element, elements }) {
		super({ element, elements });
	}

	animateIn() {
		GSAP.fromTo(
			this.element,
			{ autoAlpha: 0 },
			{ autoAlpha: 1, delay: 0.2, duration: 0.3 }
		);
	}

	animateOut() {
		GSAP.set(this.element, {
			autoAlpha: 0,
		});
	}
}
