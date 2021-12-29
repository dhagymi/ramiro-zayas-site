import axios from "axios";

import Component from "classes/Component.js";

export default class Form extends Component {
	constructor() {
		super({ element: ".contact__form", elements: {} });

		this.onSubmitEvent = this.onSubmit.bind(this);

		this.create();
	}

	getFormData(form) {
		this.formData = new FormData(form);

		this.usefulFormData = {
			name: this.formData.get("name"),
			subject: this.formData.get("subject"),
			email: this.formData.get("e-mail"),
			message: this.formData.get("message"),
		};
	}

	async onSubmit(event) {
		try {
			this.isError = false;
			this.isOk = false;
			this.isLoading = true;

			event.preventDefault();

			this.getFormData(event.target);

			this.htmlTemplate = `
			<p><b>Nombre:</b> ${this.usefulFormData.name}</p>
			<p><b>E-mail:</b> ${this.usefulFormData.email}</p>
			<p><b>Subject:</b> ${this.usefulFormData.subject}</p>
			<p><b>Mensaje:</b> ${this.usefulFormData.message}</p>`;

			this.response = await axios.post("/api/mail/contact", {
				subject: `Mensaje de ${this.usefulFormData.name} - ${this.usefulFormData.subject}`,
				html: this.htmlTemplate,
			});

			if (this.response.status === 200) {
				event.target.reset();
				this.isOk = true;
				this.isLoading = false;
				setTimeout(() => {
					this.isError = false;
					this.isOk = false;
				}, 3000);
				console.log("mail enviado");
			}
		} catch (error) {
			this.isError = true;
			this.isLoading = false;
			setTimeout(() => {
				this.isError = false;
				this.isOk = false;
			}, 3000);
			console.log(error);
		}
	}

	/* Listeners */

	addEventListeners() {
		this.element.addEventListener("submit", this.onSubmitEvent);
	}

	removeEventListeners() {
		this.element.removeEventListener("submit", this.onSubmitEvent);
	}
}
