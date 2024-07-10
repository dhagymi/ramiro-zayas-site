import axios from "axios";
import GSAP from "gsap";

import Component from "classes/Component.js";

export default class Form extends Component {
        constructor() {
                super({
                        element: ".contact__form",
                        elements: {
                                successMessage:
                                        ".contact__form__message--success",
                                errorMessage: ".contact__form__message--error",
                                checkedSvg: ".contact__form__inputs__checkbox__svgIcon--checked",
                                checkbox: ".contact__form__inputs__checkbox__input",
                                inputs: ".contact__form__inputs__input",
                                submit_button: ".contact__form__inputs__button",
                        },
                });

                this.onSubmitEvent = this.onSubmit.bind(this);
                this.onCheckboxChangedEvent = this.onCheckboxChanged.bind(this);
                this.onChangeFormEvent = this.onChangeForm.bind(this);

                this.create();
        }

        create() {
                super.create();

                this.hideAndShowCheckbox(this.elements.checkbox.checked);

                this.onChangeForm();
        }

        getFormData(form) {
                this.formData = new FormData(form);

                this.usefulFormData = {
                        name: this.formData.get("name"),
                        subject: this.formData.get("subject"),
                        email: this.formData.get("e-mail"),
                        message: this.formData.get("message"),
                        agree: !!this.formData.get("privacyPolicy"),
                };
        }

        showMessage(element) {
                GSAP.to(element, { display: "block" });
                GSAP.to(element, { autoAlpha: 1 });
                setTimeout(() => {
                        GSAP.to(element, { autoAlpha: 0 });
                        GSAP.to(element, { display: "none" });
                }, 3000);
        }

        hideAndShowCheckbox(isChecked) {
                if (isChecked) {
                        this.showCheckbox();
                } else {
                        this.hideCheckbox();
                }
        }

        hideCheckbox() {
                GSAP.to(this.elements.checkedSvg, {
                        autoAlpha: 0,
                        duration: 0.3,
                });
        }

        showCheckbox() {
                GSAP.to(this.elements.checkedSvg, {
                        autoAlpha: 1,
                        duration: 0.3,
                });
        }

        validate() {
                if (!this.usefulFormData) return false;

                if (Object.values(this.usefulFormData).some((value) => !value))
                        return false;

                if (
                        !this.usefulFormData.email.match(
                                new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
                        )
                )
                        return false;

                return true;
        }

        resetForm(form) {
                form.reset();
                this.elements.checkbox.checked = false;
                this.hideAndShowCheckbox();
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
                                this.resetForm(event.target);
                                this.isOk = true;
                                this.isLoading = false;
                                this.showMessage(this.elements.successMessage);
                                setTimeout(() => {
                                        this.isError = false;
                                        this.isOk = false;
                                }, 3000);
                        }
                } catch (error) {
                        this.isError = true;
                        this.isLoading = false;
                        this.showMessage(this.elements.errorMessage);
                        setTimeout(() => {
                                this.isError = false;
                                this.isOk = false;
                        }, 3000);
                        console.log(error);
                }
        }

        onCheckboxChanged(event) {
                this.hideAndShowCheckbox(event.target.checked);
        }

        onChangeForm() {
                this.getFormData(this.element);

                this.elements.submit_button.disabled = !this.validate();
        }

        /* Listeners */

        addEventListeners() {
                this.element.addEventListener("submit", this.onSubmitEvent);
                this.elements.checkbox.addEventListener(
                        "change",
                        this.onCheckboxChangedEvent
                );
                [this.elements.checkbox, ...this.elements.inputs].forEach(
                        (input) =>
                                input.addEventListener(
                                        "change",
                                        this.onChangeFormEvent
                                )
                );
        }

        removeEventListeners() {
                this.element.removeEventListener("submit", this.onSubmitEvent);
                this.elements.checkbox.removeEventListener(
                        "change",
                        this.onCheckboxChangedEvent
                );
                [this.elements.checkbox, ...this.elements.inputs].forEach(
                        (input) =>
                                input.removeEventListener(
                                        "change",
                                        this.onChangeFormEvent
                                )
                );
        }
}
