import GSAP from "gsap";
import { map, each } from "lodash";

import Component from "classes/Component.js";
import HideHover from "classes/HideHover.js";

export default class Options extends Component {
        constructor() {
                super({
                        element: ".social",
                        elements: {},
                        generalComponents: {
                                list: ".social__list",
                                listItems: ".social__list__item",
                                musicCardNext: ".music__videos__card--next",
                        },
                });

                this.create();
        }

        /* Create */

        create() {
                super.create();

                this.socialMediaQuantity =
                        this.generalComponents?.listItems?.length / 2;

                if (this.generalComponents.musicCardNext) {
                        this.listItemHideHovers = map(
                                this.generalComponents.listItems,
                                (item, index) => {
                                        if (index < this.socialMediaQuantity) {
                                                return new HideHover({
                                                        element: `.social__list__item:nth-child(${
                                                                index + 1
                                                        })`,
                                                        generalComponents: {
                                                                toHover: this
                                                                        .generalSelectors
                                                                        .musicCardNext,
                                                        },
                                                });
                                        }
                                }
                        );
                }
        }

        update() {
                if (this.generalComponents.musicCardNext) {
                        each(this.listItemHideHovers, (hideHover) => {
                                if (hideHover) {
                                        hideHover.update();
                                }
                        });
                }
        }

        /* Animations */

        showElement(elements) {
                return new Promise((resolve) => {
                        this.timeline = GSAP.timeline();
                        if (Array.isArray(elements)) {
                                elements.forEach((element) => {
                                        this.timeline.to(element, {
                                                autoAlpha: 1,
                                                onComplete: resolve,
                                        });
                                });
                        } else {
                                this.timeline.to(elements, {
                                        autoAlpha: 1,
                                        onComplete: resolve,
                                });
                        }
                });
        }

        hideElement(elements) {
                return new Promise((resolve) => {
                        this.timeline = GSAP.timeline();
                        if (Array.isArray(elements)) {
                                elements.forEach((element) => {
                                        this.timeline.to(element, {
                                                autoAlpha: 0,
                                                onComplete: resolve,
                                        });
                                });
                        } else {
                                this.timeline.to(elements, {
                                        autoAlpha: 0,
                                        onComplete: resolve,
                                });
                        }
                });
        }

        /* Events */
        onChange() {
                this.generalComponents.musicCardNext = document.querySelector(
                        this.generalSelectors.musicCardNext
                );
                if (this.generalComponents.musicCardNext) {
                        this.listItemHideHovers = map(
                                this.generalComponents.listItems,
                                (item, index) => {
                                        if (index < this.socialMediaQuantity) {
                                                return new HideHover({
                                                        element: `.social__list__item:nth-child(${
                                                                index + 1
                                                        })`,
                                                        generalComponents: {
                                                                toHover: this
                                                                        .generalSelectors
                                                                        .musicCardNext,
                                                        },
                                                });
                                        }
                                }
                        );
                }

                each(this.generalComponents.listItems, (item, index) => {
                        if (index < this.socialMediaQuantity) {
                                this.showElement(item);
                        }
                });
        }
}
