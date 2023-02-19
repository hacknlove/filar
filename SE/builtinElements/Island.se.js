const vm = require("vm");
const { DOMParser } = require("linkedom");
const parser = new DOMParser();

async function processCustomElement(element, context) {
    const attributes = element.getAttributeNames();

    const state = {};

    for (const attribute of attributes) {
        state[attribute] = await vm.runInNewContext(element.getAttribute(attribute), context);
    }

    element.parentNode.classList.add("island");

    const newContextScript = parser.parseFromString(`<script>document.currentScript.parentNode.island=${JSON.stringify(state)})</script>`).firstElementChild;

    element.parentNode.insertBefore(newContextScript, element);
    element.parentNode.island = state;
    element.remove();
  }
  
  exports.processCustomElement = processCustomElement;
  