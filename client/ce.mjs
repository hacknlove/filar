function initializece(js, name) {
  class CustomElement extends HTMLElement {
    constructor() {
      super();
      if (js.constructor) {
        js.constructor.apply(this);
      }

      function mutationObserverCalback(mutationList) {
        for (let mutation of mutationList) {
          if (mutation.type !== "attributes") {
            continue;
          }
          const name = mutation.attributeName;
          const rawValue = mutation.target.getAttribute(name);
          const oldValue = this.state[name];

          const fn = new Function(
            ["_state", "from", "parent"],
            `\
              const { ${Object.keys(this.state).join(", ")} } = _state;
              return ${rawValue};\n`
          );
          const value = fn(this.state);

          js.attributeChangedCallback?.(this, { name, value, oldValue });

          this.state[name] = value;
        }
      }

      this.observer = new MutationObserver(mutationObserverCalback.bind(this));
      this.observer.observe(this, {
        attributes: true,
        childList: false,
        subtree: false,
      });
    }

    connectedCallback() {
      js.connectedCallback?.(this);
      console.info("Custom square element added to page.");
    }

    disconnectedCallback() {
      js.disconnectedCallback?.(this);
      console.info("Custom square element removed from page.");
    }

    adoptedCallback() {
      js.adoptedCallback?.(this);
    }
  }

  customElements.define(name, CustomElement);
}

export default initializece;
