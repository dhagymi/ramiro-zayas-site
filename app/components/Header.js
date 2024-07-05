import Component from "classes/Component.js";

export default class Header extends Component {
  constructor({ template, interactionComponents }) {
    super({
      element: ".header",
      elements: {
        logo: ".header__link",
        navBar: ".header__navigation",
        navLink: ".header__navigation__list__link",
        options: ".header__options",
        menuButton: ".header__options__menu",
      },
      isScrolleable: false,
    });

    this.interactionComponents = interactionComponents;

    this.onChange(template);
    this.onMenuClickEvent = this.onMenuClick.bind(this);
  }

  create() {
    super.create();

    this.interactionComponents.responsiveNavBar.create();
  }

  onMenuClick() {
    if (this.interactionComponents.responsiveNavBar.isVisible) {
      this.interactionComponents.responsiveNavBar.hide();
    } else {
      this.interactionComponents.responsiveNavBar.show();
    }
  }

  onChange(template) {}

  addEventListeners() {
    super.addEventListeners();
    this.elements.menuButton.addEventListener("click", this.onMenuClickEvent);
  }
}
