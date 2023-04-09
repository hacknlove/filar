const vm = require("vm");

function elementAttributesToObject(element) {
  const attributes = {};

  for (const attribute of element.attributes) {
    attributes[attribute.name] = attribute.value;
  }

  return attributes;
}

async function makeAnIsland(targetElement, attributes, context) {
  const currentIslandId =
    targetElement.getAttribute("id") || `i-${context.Indexes.lastIslandId++}`;

  const state = {};

  const external = [];

  for (const attribute in attributes) {
    const from = (islandId, expression) => {
      const fromState = context.__islands[islandId].state;

      if (!fromState) {
        throw new Error("Island not found", {
          cause: {
            islandId,
            attribute,
            value: attributes[attribute],
          },
        });
      }

      external.push([attribute, islandId, expression]);

      return vm.runInNewContext(expression, fromState);
    };
    const parent = (expression) => {
      let node = targetElement.parentNode;
      while (node && !node.island) {
        node = node.parentNode;
      }

      if (!node) {
        throw new Error("Parent island not found", {
          cause: {
            attribute,
            value: attributes[attribute],
          },
        });
      }

      return from(node.islandId, expression);
    };
    const vmContext = Object.create(context);
    Object.assign(vmContext, { parent, from });
    try {
      state[attribute] = await vm.runInNewContext(
        attributes[attribute],
        vmContext
      );
    } catch (error) {
      throw new Error("Error in island", {
        cause: {
          attribute,
          value: attributes[attribute],
          error,
        },
      });
    }
  }

  if (!targetElement.getAttribute("id")) {
    targetElement.setAttribute("id", currentIslandId);
  }
  context.__islands[currentIslandId] = {
    state,
    external,
    expressions: {},
    offsets: {},
  };
}

async function processServerElement(element, context) {
  const targetElement = element.parentNode;

  await makeAnIsland(
    targetElement,
    elementAttributesToObject(element),
    context
  );

  element.remove();
}

exports.processServerElement = processServerElement;
exports.makeAnIsland = makeAnIsland;
exports.elementAttributesToObject = elementAttributesToObject;
