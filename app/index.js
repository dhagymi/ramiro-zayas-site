import { each } from "lodash";

import Concerts from "pages/Concerts/index.js";
import Home from "pages/Home/index.js";
import Contact from "pages/Contact/index.js";
import Gallery from "pages/Gallery/index.js";
import Music from "pages/Music/index.js";
import Imprint from "pages/Imprint/index.js";
import ErrorPage from "pages/Error/index.js";

import Cursor from "components/Cursor.js";
import Preloader from "components/Preloader.js";
import Header from "components/Header.js";
import ResponsiveNavBar from "components/ResponsiveNavBar.js";
import Footer from "components/Footer.js";
import ScrollBar from "components/ScrollBar.js";
import Options from "components/Options.js";
import Social from "components/Social.js";

class App {
        constructor() {
                this.createContent();

                this.createCursor();
                this.createPreloader();
                this.createFooter();
                this.createResponsiveNavBar();
                this.createHeader();
                this.createOptions();
                this.createSocial();
                this.createPages();
                this.createScrollBar();
                this.createTitle();

                this.addEventListeners();
                this.addLinkListeners();

                this.update();

                console.log(
                        `%cDeveloped & Designed by DHATeam ${String.fromCodePoint(
                                0x0270c
                        )}`,
                        "color: #F8F8F8; background: #2F2F2F; padding: 5px 10px; border-radius: 3px; font-family: 'Verdana'"
                );
        }

        /* Creates */

        createCursor() {
                this.cursor = new Cursor();
                this.cursor.create();
        }

        createPreloader() {
                this.preloader = new Preloader();
                this.preloader.once("completed", this.onPreloaded.bind(this));
        }

        createHeader() {
                this.header = new Header({
                        template: this.template,
                        interactionComponents: {
                                responsiveNavBar: this.responsiveNavBar,
                        },
                });
                this.header.create();
        }

        createResponsiveNavBar() {
                this.responsiveNavBar = new ResponsiveNavBar({
                        template: this.template,
                });
        }

        createFooter() {
                this.footer = new Footer({ template: this.template });
                this.footer.create();
        }

        createScrollBar() {
                this.scrollBar = new ScrollBar({
                        updateScroll: this.updateScroll.bind(this),
                });
                this.scrollBar.create();
        }

        createOptions() {
                this.options = new Options();
        }

        createSocial() {
                this.social = new Social();
        }

        createContent() {
                this.content = document.querySelector(".content");
                this.template = this.content.getAttribute("data-template");
        }
        createPages() {
                this.pages = {
                        home: new Home({
                                globalOnResize: this.onResize.bind(this),
                        }),
                        music: new Music({
                                globalOnResize: this.onResize.bind(this),
                        }),
                        concerts: new Concerts({
                                globalOnResize: this.onResize.bind(this),
                        }),
                        contact: new Contact({
                                globalOnResize: this.onResize.bind(this),
                        }),
                        gallery: new Gallery({
                                globalOnResize: this.onResize.bind(this),
                        }),
                        imprint: new Imprint({
                                globalOnResize: this.onResize.bind(this),
                        }),
                        error: new ErrorPage({
                                globalOnResize: this.onResize.bind(this),
                        }),
                };

                this.page = this.pages[this.template];
                this.page.create();
        }

        createTitle() {
                this.title = document.querySelector("title");
                this.title.innerText = `Ramiro Zayas  |  ${this.page.title}`;
        }

        /* Links */

        addLinkListeners() {
                this.links = document.querySelectorAll("a");
                this.boundedLinkCallback =
                        this.linkListenersCallback.bind(this);

                each(this.links, (link) => {
                        link.addEventListener(
                                "click",
                                this.boundedLinkCallback
                        );
                });
        }

        removeLinkListeners() {
                each(this.links, (link) => {
                        link.removeEventListener(
                                "click",
                                this.boundedLinkCallback
                        );
                });
        }

        linkListenersCallback(event) {
                let link;
                if (!(event.target instanceof window.HTMLAnchorElement)) {
                        link = event.target.parentNode;
                        while (!(link instanceof window.HTMLAnchorElement)) {
                                link = link.parentNode;
                        }
                } else {
                        link = event.target;
                }

                const { href: url } = link;
                const location = url.split("/")[url.split("/").length - 1];
                if (url.includes(window.location.origin)) {
                        event.preventDefault();
                }

                if (
                        location !== this.template &&
                        !(location.trim() === "" && this.template === "home")
                ) {
                        if (url.includes(window.location.origin)) {
                                this.onChange({ url });
                        }
                }
        }

        /* Loop */
        update() {
                if (this.page && this.page.update) {
                        this.page.update();
                }

                if (this.header && this.header.update) {
                        this.header.update(this.page.showed || false);
                }

                if (this.footer && this.footer.update) {
                        this.footer.update(this.page.showed || false);
                }

                if (this.scrollBar && this.scrollBar.update) {
                        this.scrollBar.update(this.page.showed || false);
                }

                if (this.cursor && this.cursor.update) {
                        this.cursor.update(true);
                }

                if (this.options && this.options.update) {
                        this.options.update(true);
                }

                if (this.social && this.social.update) {
                        this.social.update(true);
                }

                this.frame = window.requestAnimationFrame(
                        this.update.bind(this)
                );
        }

        updateScroll({ ease, current, target, limit, last }) {
                this.page.updateScroll({ ease, current, target, limit, last });
                this.header.updateScroll({
                        ease,
                        current,
                        target,
                        limit,
                        last,
                });
                this.footer.updateScroll({
                        ease,
                        current,
                        target,
                        limit,
                        last,
                });
                this.scrollBar.updateScroll({
                        ease,
                        current,
                        target,
                        limit,
                        last,
                });
        }

        /* Events */
        async onChange({ url, push = true }) {
                this.removeLinkListeners();
                this.page.hide();

                const request = await fetch(url);

                if (request.status === 200) {
                        const html = await request.text();
                        const div = document.createElement("div");
                        if (push) {
                                window.history.pushState({}, "", url);
                        }

                        div.innerHTML = html;

                        const divContent = div.querySelector(".content");

                        this.template =
                                divContent.getAttribute("data-template");

                        this.header.onChange(this.template);
                        this.responsiveNavBar.onChange(this.template);
                        this.footer.onChange(this.template);

                        this.content.setAttribute(
                                "data-template",
                                this.template
                        );
                        this.content.innerHTML = divContent.innerHTML;

                        this.page = this.pages[this.template];
                        this.page.create();
                        this.createTitle();

                        this.onResize();

                        this.page.show();
                        this.options.onChange();
                        this.social.onChange();

                        this.addLinkListeners();
                } else {
                        console.log("Error");
                }
        }

        onPopState() {
                this.onChange({ url: window.location.pathname, push: false });
        }

        onPreloaded() {
                this.preloader.destroy();

                this.onResize();

                this.page.show();
        }

        onResize() {
                if (this.page && this.page.onResize) {
                        this.page.onResize();
                        if (this.header?.onResize) {
                                this.header.onResize(
                                        this.page.elements.wrapper
                                );
                        }
                        if (this.footer?.onResize) {
                                this.footer.onResize(
                                        this.page.elements.wrapper
                                );
                        }
                        if (this.scrollBar?.onResize) {
                                this.scrollBar.onResize(
                                        this.page.elements.wrapper
                                );
                        }
                }
        }

        /* Listeners */

        addEventListeners() {
                window.addEventListener("popstate", this.onPopState.bind(this));
                window.addEventListener("resize", this.onResize.bind(this));
        }
}

new App();
