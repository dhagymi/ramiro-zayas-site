import Component from "classes/Component";

export default class Carousel extends Component {
	constructor() {
		super({
			element: ".music__vidoes",
			elements: {
				wrapper: ".music__videos__wrapper",
				cards: ".music__videos__card",
				previousButton: ".music__videos__controls__button--left",
				nextButton: ".music__videos__controls__button--right",
				position: ".music__videos__controls__position",
			},
		});
	}
}
