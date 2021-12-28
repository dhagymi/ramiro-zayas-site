import Page from "classes/Page.js";

export default class Contact extends Page {
	constructor({ globalOnResize }) {
		super({
			id: "contact",
			element: ".contact",
			elements: { wrapper: ".contact__wrapper" },
			title: "Contact",
			globalOnResize,
		});
	}
}
