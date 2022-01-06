import Component from "classes/Component.js";

export default class Audio extends Component {
	constructor() {
		super({ element: "audio", elements: { sources: "source" } });
	}

	/* Controls */

	async play() {
		if (this.canPlay()) {
			alert("In play");
			try {
				await this.element.play();

				alert("Play ok");
				this.element.muted = false;
				return true;
			} catch (error) {
				alert(error.message);
				console.log(error);
				return false;
			}
		}
	}

	canPlay() {
		if (this.element.readyState > 2) {
			alert(this.element.readyState);
			return true;
		} else {
			alert(this.element.readyState);
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
