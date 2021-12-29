import Page from "classes/Page.js";

export default class ErrorPage extends Page {
	constructor({ globalOnResize }) {
		super({
			id: "error",
			element: ".error",
			elements: { wrapper: ".error__wrapper" },
			title: "Page not found",
			globalOnResize,
		});
	}
}
