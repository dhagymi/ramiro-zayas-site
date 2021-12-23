import Page from "classes/Page.js";

export default class Music extends Page {
	constructor() {
		super({
			id: "music",
			element: ".music",
			elements: { wrapper: ".music__wrapper" },
			title: "Music",
		});
	}
}
