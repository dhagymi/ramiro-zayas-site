import Component from "classes/Component.js";

export default class Audio extends Component {
	constructor() {
		super({ element: "audio", elements: { sources: "source" } });
	}

	/* Controls */

	async play() {
		if (this.canPlay()) {
			try {
				await this.element.play();
				this.element.muted = false;
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		}
	}

	canPlay() {
		if (this.element.readyState > 2) {
			return true;
		} else {
			return false;
		}
	}

	async pause() {
		try {
			await this.element.pause();
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	/* Listeners */

	addEventListeners() {
		this.element.addEventListener("canplaythrough", this.onCanPlayEvent);
	}
}
