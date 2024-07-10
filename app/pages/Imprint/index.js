import Page from "classes/Page.js";

export default class Home extends Page {
        constructor({ globalOnResize }) {
                super({
                        id: "imprint",
                        element: ".imprint",
                        elements: {
                                wrapper: ".imprint__wrapper",
                        },
                        title: "Imprint",
                        globalOnResize,
                });
        }
}
