import GSAP from "gsap";

import Component from "classes/Component.js";

export default class ResponsiveNavBar extends Component {
	constructor({ template }) {
		super({
			element: ".navigationResponsive",
			elements: {
				header: ".navigationResponsive__subHeader",
				logo: ".navigationResponsive__subHeader__link",
				closeButton: ".navigationResponsive__subHeader__closeButton",
				navList: ".navigationResponsive__list",
				navLinks: ".navigationResponsive__list__link",
				social: ".navigationResponsive__social",
				socialButtons: ".navigationResponsive__social button",
			},
		});

		this.onCloseClickEvent = this.onCloseClick.bind(this);
		this.onChange(template);
	}

	create() {
		super.create();

		this.hide();
	}

	/* Animations */
	show() {
		return new Promise((resolve) => {
			this.timeline = GSAP.timeline();
			this.timeline.to(this.element, { autoAlpha: 1, onComplete: resolve });

			this.isVisible = true;
		});
	}

	hide() {
		return new Promise((resolve) => {
			this.timeline = GSAP.timeline();
			this.timeline.to(this.element, { autoAlpha: 0, onComplete: resolve });

			this.isVisible = false;
		});
	}

	/* Events */
	onChange(template) {}

	onCloseClick() {
		this.hide();
	}

	/* Listeners */

	addEventListeners() {
		super.addEventListeners();
		this.elements.closeButton.addEventListener("click", this.onCloseClickEvent);
		this.elements.navLinks.forEach((link) => {
			link.addEventListener("click", this.onCloseClickEvent);
		});
	}
}
