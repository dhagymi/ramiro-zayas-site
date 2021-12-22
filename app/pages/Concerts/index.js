import Page from "classes/Page.js";

export default class Concerts extends Page {
	constructor() {
		super({
			id: "concerts",
			element: ".concerts",
			elements: { wrapper: ".concerts__wrapper" },
		});
	}
}
