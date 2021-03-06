import Page from "classes/Page.js";

export default class Home extends Page {
	constructor({ globalOnResize }) {
		super({
			id: "home",
			element: ".home",
			elements: {
				title: ".home__title",
				button: ".home__button",
				wrapper: ".home__wrapper",
			},
			title: "Pianist and composer based in Berlin",
			globalOnResize,
		});
	}
}
