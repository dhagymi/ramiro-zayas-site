import Component from "classes/Component.js";

export default class Footer extends Component {
	constructor({ template }) {
		super({
			element: ".footer",
			elements: {
				copyright: ".footer__copyright",
				devAndDesign: ".footer__devAndDesign",
			},
			isScrolleable: true,
		});

		this.onChange(template);
	}

	onChange(template) {}
}
