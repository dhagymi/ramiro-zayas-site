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

	async load() {
		try {
			await this.element.load();
			this.isLoaded = true;
		} catch (error) {
			this.isLoaded = false;
		}
	}

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
		} else if (isLoaded) {
			this.play();
		} else {
			await this.load();
			this.play();
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

	/* Events */

	onStalled() {
		this.load();
	}

	/* Listeners */

	addEventListeners() {
		this.element.addEventListener("canplaythrough", this.onCanPlayEvent);
	}
}
