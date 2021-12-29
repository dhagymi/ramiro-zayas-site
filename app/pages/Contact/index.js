import Page from "classes/Page.js";

import Form from "components/Form.js";

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

	create() {
		super.create();

		this.form = new Form();
	}
}
