import prefix from "prefix";
import GSAP from "gsap";
import normalizeWheel from "normalize-wheel";

import Component from "classes/Component.js";

import { lerp, clamp } from "utils/math.js";

export default class ScrollBar extends Component {
	constructor() {
		super({
			element: ".scrollBar",
			elements: {
				background: ".scrollBar__background",
				bar: ".scrollBar__bar",
			},
			isScrolleable: true,
		});

		this.topPrefix = prefix("top");
		this.onMouseOverEvent = this.onMouseOver.bind(this);
		this.onMouseLeaveEvent = this.onMouseLeave.bind(this);
	}

	async update(available = true) {
		this.availableToUpdate = available;

		if (this.availableToUpdate) {
			this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target);

			if (
				lerp(this.scroll.current, this.scroll.target, this.scroll.ease) < 0.01
			) {
				this.scroll.current = 0;
			} else {
				this.scroll.current = lerp(
					this.scroll.current,
					this.scroll.target,
					this.scroll.ease
				);
			}

			this.percent = this.scroll.current / this.scroll.limit;

			if (this.elements.bar) {
				this.elements.bar.style[this.topPrefix] = `${90 * this.percent}%`;
			}
		}
	}

	create() {
		super.create();
		this.hide();
	}

	/* Animations */
	show() {
		return new Promise((resolve) => {
			this.timeline = GSAP.timeline();
			this.timeline.to(this.element, { opacity: 1, onComplete: resolve });
		});
	}

	hide() {
		return new Promise((resolve) => {
			this.timeline = GSAP.timeline();
			this.timeline.to(this.element, { opacity: 0, onComplete: resolve });
		});
	}

	/* Events */
	onMouseWheel(event) {
		if (this.availableToUpdate) {
			const { pixelY } = normalizeWheel(event);

			this.scroll.target += pixelY;

			if (pixelY !== 0) {
				if (this.timer) {
					clearTimeout(this.timer);
				}
				this.show();
				this.timer = setTimeout(() => {
					this.hide();
				}, 1500);
			}
		}
	}

	onTouchDown(event) {
		if (this.availableToUpdate) {
			this.isTouching = true;

			this.y.start = event.touches[0].clientY;
		}
	}

	onTouchMove(event) {
		if (this.availableToUpdate) {
			if (!this.isTouching) return;

			this.y.end = event.touches[0].clientY;

			this.y.difference = this.y.start - this.y.end;
			this.y.start = this.y.end;
			this.scroll.target += this.y.difference * 4;

			if (this.y.difference !== 0) {
				if (this.timer) {
					clearTimeout(this.timer);
				}
				this.show();
				this.timer = setTimeout(() => {
					this.hide();
				}, 1500);
			}
		}
	}

	onTouchUp(event) {
		if (this.availableToUpdate) {
			this.isTouching = false;

			this.y.end = event.changedTouches[0].clientY;

			this.y.difference = this.y.start - this.y.end;

			this.scroll.target += this.y.difference * 4;

			if (this.y.difference !== 0) {
				if (this.timer) {
					clearTimeout(this.timer);
				}
				this.show();
				this.timer = setTimeout(() => {
					this.hide();
				}, 1500);
			}
		}
	}

	onMouseOver() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.show();
	}

	onMouseLeave() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(() => {
			this.hide();
		}, 1500);
	}

	/* Listeners */

	addEventListeners() {
		super.addEventListeners();
		this.element.addEventListener("mouseover", this.onMouseOverEvent);
		this.element.addEventListener("mouseleave", this.onMouseLeaveEvent);
	}

	removeEventListeners() {
		super.removeEventListeners();
		this.element.removeEventListener("mouseover", this.onMouseOverEvent);
		this.element.removeEventListener("mouseleave", this.onMouseLeaveEvent);
	}
}
