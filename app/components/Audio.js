import Component from "classes/Component.js";

export default class Audio extends Component {
	constructor() {
		super({ element: "audio", elements: { sources: "source" } });
	}

	/* Controls */

	play() {
		if (this.canPlay()) {
			this.element.play();
		}
	}

	canPlay() {
		if (this.element.readyState > 2) {
			return true;
		} else {
			return false;
		}
	}

	pause() {
		this.element.pause();
	}

	/* Listeners */

	addEventListeners() {
		this.element.addEventListener("canplaythrough", this.onCanPlayEvent);
	}
}
