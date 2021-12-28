import Page from "classes/Page.js";

import Carousel from "components/Carousel.js";

export default class Music extends Page {
	constructor({ globalOnResize }) {
		super({
			id: "music",
			element: ".music",
			elements: { wrapper: ".music__wrapper" },
			title: "Music",
			globalOnResize,
		});
	}

	create() {
		super.create();
		this.createCarousel();
	}

	createCarousel() {
		this.carousel = new Carousel();
		this.carousel.create();
	}
}
