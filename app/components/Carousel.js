import GSAP from "gsap";
import { each, find, map } from "lodash";

import Component from "classes/Component.js";

export default class Carousel extends Component {
	constructor() {
		super({
			element: ".music__videos",
			elements: {
				wrapper: ".music__videos__wrapper",
				cards: ".music__videos__card",
				previousButton: ".music__videos__controls__button--left",
				nextButton: ".music__videos__controls__button--right",
				position: ".music__videos__controls__position",
			},
		});

		this.onNextClickEvent = this.onNextClick.bind(this);
		this.onPreviousClickEvent = this.onPreviousClick.bind(this);
	}

	create() {
		super.create();

		this.status = {
			current: 1,
			previous: this.elements.cards.length,
			next: 2,
		};

		this.showCards();
	}

	/* Animations */

	showCards() {
		return new Promise((resolve) => {
			const cards = map(this.elements.cards, (card) => card);
			if (Array.isArray(cards)) {
				cards.forEach((element) => {
					if (element.style.opacity !== "1") {
						GSAP.to(element, {
							autoAlpha: 1,
							onComplete: resolve,
						});
					}
				});
			} else {
				GSAP.to(cards, {
					autoAlpha: 1,
					onComplete: resolve,
				});
			}
		});
	}

	hideCards() {
		return new Promise((resolve) => {
			const cards = map(this.elements.cards, (card) => {
				return card;
			});
			if (Array.isArray(cards)) {
				cards.forEach((element) => {
					GSAP.to(element, { autoAlpha: 0, onComplete: resolve });
				});
			} else {
				GSAP.to(cards, {
					autoAlpha: 0,
					onComplete: resolve,
				});
			}
		});
	}

	async updateFrames() {
		await this.hideCards();

		const currentCard = await find(this.elements.cards, (card) => {
			return card.classList.contains(
				`music__videos__card--${this.status.current}`
			);
		});

		const previousCard = await find(this.elements.cards, (card) => {
			return card.classList.contains(
				`music__videos__card--${this.status.previous}`
			);
		});

		const nextCard = await find(this.elements.cards, (card) => {
			return card.classList.contains(
				`music__videos__card--${this.status.next}`
			);
		});

		await each(this.elements.cards, (card) => {
			if (card.classList.contains(`music__videos__card--current`)) {
				card.classList.remove(`music__videos__card--current`);
			}

			if (card.classList.contains(`music__videos__card--previous`)) {
				card.classList.remove(`music__videos__card--previous`);
			}

			if (card.classList.contains(`music__videos__card--next`)) {
				card.classList.remove(`music__videos__card--next`);
			}
		});

		currentCard.classList.add("music__videos__card--current");
		previousCard.classList.add("music__videos__card--previous");
		nextCard.classList.add("music__videos__card--next");

		await this.showCards();
	}

	/* Events */

	onNextClick() {
		each(this.status, (prop, key) => {
			if (prop < this.elements.cards.length) {
				this.status[key] += 1;
			} else {
				this.status[key] = 1;
			}
		});

		this.elements.position.innerText =
			parseInt(this.elements.position.innerText) ===
			parseInt(this.elements.cards.length)
				? "1"
				: parseInt(this.elements.position.innerText) + 1;

		this.updateFrames();
	}

	onPreviousClick() {
		each(this.status, (prop, key) => {
			if (prop > 1) {
				this.status[key] -= 1;
			} else {
				this.status[key] = this.elements.cards.length;
			}
		});

		this.elements.position.innerText =
			parseInt(this.elements.position.innerText) === 1
				? this.elements.cards.length
				: parseInt(this.elements.position.innerText) - 1;

		this.updateFrames();
	}

	/* Listeners */

	addEventListeners() {
		this.elements.nextButton.addEventListener("click", this.onNextClickEvent);
		this.elements.previousButton.addEventListener(
			"click",
			this.onPreviousClickEvent
		);
	}
}
