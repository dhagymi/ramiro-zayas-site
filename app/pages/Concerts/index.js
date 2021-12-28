import { each } from "lodash";
import axios from "axios";

import Page from "classes/Page.js";

import { innerHtmlTemplate, outerHtmlTemplate } from "../../utils/concerts.js";

export default class Concerts extends Page {
	constructor(superiorOrderOnResize) {
		super({
			id: "concerts",
			element: ".concerts",
			elements: {
				wrapper: ".concerts__wrapper",
				observers: ".concerts__shows__littleList__observer",
				shows: ".concerts__shows",
			},
			title: "Concerts",
		});

		this.globalOnResize = superiorOrderOnResize;
	}

	create() {
		super.create();

		this.createObservers();
	}

	createObservers() {
		this.observers = [];

		if (this.elements.observers.length && this.elements.observers.length > 1) {
			each(this.elements.observers, (observer) => {
				const newObserver = new IntersectionObserver(async (entries) => {
					entries.forEach(async (entry) => {
						if (entry.isIntersecting) {
							const { data } = await axios("/getConcerts");

							const concerts = data.map((array) => {
								return array.map((concert) => {
									return concert.data;
								});
							});

							const littleList =
								concerts[parseInt(entry.target.dataset.observer)];

							if (
								littleList &&
								parseInt(entry.target.dataset.observer) >= this.observers.length
							) {
								const innerHtml = await littleList.reduce(
									(previousEntry, nextEntry) =>
										(previousEntry += innerHtmlTemplate(nextEntry)),
									""
								);
								const outerHtml = outerHtmlTemplate(
									parseInt(entry.target.dataset.observer) + 1,
									innerHtml
								);
								this.elements.shows.innerHTML += outerHtml;

								this.globalOnResize();

								this.oldScroll = this.scroll;

								this.create();

								this.scroll = this.oldScroll;
							}
						}
					});
				});
				newObserver.observe(observer);

				this.observers.push(newObserver);
			});
		} else {
			const newObserver = new IntersectionObserver(async (entries) => {
				entries.forEach(async (entry) => {
					if (entry.isIntersecting) {
						const { data } = await axios("/getConcerts");

						const concerts = data.map((array) => {
							return array.map((concert) => {
								return concert.data;
							});
						});

						const littleList =
							concerts[parseInt(entry.target.dataset.observer)];

						if (littleList) {
							const innerHtml = await littleList.reduce(
								(previousEntry, nextEntry) =>
									(previousEntry += innerHtmlTemplate(nextEntry)),
								""
							);
							const outerHtml = outerHtmlTemplate(
								parseInt(entry.target.dataset.observer) + 1,
								innerHtml
							);
							this.elements.shows.innerHTML += outerHtml;

							this.globalOnResize();

							this.oldScroll = this.scroll;

							this.create();

							this.scroll = this.oldScroll;
						}
					}
				});
			});
			newObserver.observe(this.elements.observers);

			this.observers.push(newObserver);
		}
	}
}
