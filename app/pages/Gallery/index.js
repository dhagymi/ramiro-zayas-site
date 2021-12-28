import Page from "classes/Page.js";

export default class Gallery extends Page {
	constructor({ globalOnResize }) {
		super({
			id: "gallery",
			element: ".gallery",
			elements: { wrapper: ".gallery__wrapper", images: "img" },
			title: "Gallery",
			globalOnResize,
		});
	}
}
