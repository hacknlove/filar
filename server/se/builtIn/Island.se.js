const vm = require("vm");
const { getRoot } = require("../../tree/getRoot");

async function processCustomElement(element, context) {
  const root = getRoot(element);

  const attributes = element.getAttributeNames();
  const parentNode = element.parentNode;

  const currentIslandId =
    parentNode.getAttribute("id") || `i-${context.lastIslandId++}`;

  const state = {};

  const external = [];

  for (const attribute of attributes) {
    const from = (islandId, expression) => {
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
    const vmContext = Object.create(context);
    Object.assign(vmContext, { parent, from });
    state[attribute] = await vm.runInNewContext(
      element.getAttribute(attribute),
      vmContext
    );
  }

  if (!parentNode.getAttribute("id")) {
    parentNode.setAttribute("id", currentIslandId);
  }

  element.remove();

  context.__islands[currentIslandId] = {
    state,
    external,
    expressions: {},
    offsets: {},
  };
}

exports.processCustomElement = processCustomElement;
