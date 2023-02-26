const vm = require("vm");
const { DOMParser } = require("linkedom");
const parser = new DOMParser();
const { getRoot } = require("../../tree/getRoot");

let lastIslandId = 0;

async function processCustomElement(element, context) {
  const attributes = element.getAttributeNames();
  const currentIslandId = `i-${lastIslandId++}`;

  const state = {};

  const external = [];

  for (const attribute of attributes) {
    const from = (islandId, expression) => {
      const root = getRoot(element);
      const islandScriptElement = root.getElementById(islandId);

      if (!islandScriptElement) {
        throw new Error("Island not found", {
          cause: {
            islandId,
            attribute,
            value: element.getAttribute(attribute),
          },
        });
      }

      external.push([attribute, islandId, expression]);

      return vm.runInContext(expression, islandScriptElement.parent.island);
    };
    const parent = (expression) => {
      let node = element.parentNode.parentNode;
      while (node && !node.island) {
        node = node.parentNode;
      }

      if (!node) {
        throw new Error("Parent island not found", {
          cause: {
            attribute,
            value: element.getAttribute(attribute),
          },
        });
      }

      return from(node.islandId, expression);
    };
    state[attribute] = await vm.runInNewContext(
      element.getAttribute(attribute),
      {
        ...context,
        parent,
        from,
      }
    );
  }

  element.parentNode.classList.add("island");

  const newContextScript = parser.parseFromString(
    `<script id=${currentIslandId}>document.currentScript.parentNode.island=${JSON.stringify(
      state
    )})</script>`
  ).firstElementChild;

  element.parentNode.insertBefore(newContextScript, element);
  element.parentNode.island = state;
  element.remove();
}

exports.processCustomElement = processCustomElement;
