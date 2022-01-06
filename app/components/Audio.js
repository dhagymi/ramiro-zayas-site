import Component from "classes/Component.js";

export default class Audio extends Component {
	constructor() {
		super({ element: "audio", elements: { sources: "source" } });

		this.onStalledEvent = this.onStalled.bind(this);
	}

	create() {
		super.create();

		this.element.addEventListener("stalled", this.onStalledEvent);

		this.load();
	}

	/* Controls */

	load() {
		try {
			this.element.load();
			alert("loading");
		} catch (error) {
			alert(error.message);
		}
	}

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

	/* Events */

	onStalled() {
		alert("stalled");
		this.load();
	}

	/* Listeners */

	addEventListeners() {
		this.element.addEventListener("canplaythrough", this.onCanPlayEvent);
	}
}
