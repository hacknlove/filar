const proxyHandler = {
  get: (target, key, receriver) => {
    if (key === "__state__") {
      return target.state;
    }
    if (key === "__keys__") {
      return Object.keys(target.state);
    }

    const value = Reflect.get(target.state, key, receriver);
    if (!value) {
      return;
    }
    if (typeof value === "object") {
      return new Proxy(
        {
          state: value,
          island: target.island,
        },
        proxyHandler
      );
    }
    return value;
  },
  set: (target, key, value) => {
    Reflect.set(target.state, key, value, target.state);

    target.island.dispatchEvent(new CustomEvent("state"));
    target.island.refreshIsland();
  },
};

function getTextNode(elementNode, number) {
  for (const child of elementNode.childNodes) {
    if (child.nodeType === Node.TEXT_NODE && number-- === 0) return child;
  }
}

export function initExpression(island, expression, runtime) {
  runtime.process = () => {
    const fn = new Function(
      ["_state"],
      `\
        const { ${Object.keys(island.state).join(", ")} } = _state;
        return ${expression.toString()};\n`
    );
    const newValue = fn(island.state).toString();
    if (newValue === runtime.value) {
      return;
    }
    runtime.replacements.forEach(([nodeId, attribute, replaceIndex]) => {
      const offset = island.offsets[nodeId][attribute][replaceIndex];
      const node = document.getElementById(nodeId);

      const oldText = attribute.startsWith("t-")
        ? getTextNode(node, attribute.slice(2)).textContent
        : node.getAttribute(attribute);

      const newText =
        oldText.slice(0, offset) +
        newValue +
        oldText.slice(offset + runtime.value.length);

      if (newValue.length !== runtime.value.length) {
        island.offsets[nodeId][attribute]
          .slice(replaceIndex + 1)
          .forEach((offset, index) => {
            island.offsets[nodeId][attribute][replaceIndex + 1 + index] +=
              newValue.length - runtime.value.length;
          });
      }

      if (attribute.startsWith("t-")) {
        getTextNode(node, attribute.slice(2)).textContent = newText;
      } else {
        node.setAttribute(attribute, newText);
      }
    });
    runtime.value = newValue;
  };
}

export function initIsland([islandId, island]) {
  const islandElement = document.getElementById(islandId);

  islandElement.refreshIsland = () => {
    Object.values(island.expressions).forEach((runtime) => runtime.process());
  };

  islandElement.state = new Proxy(
    {
      island: islandElement,
      state: island.state,
    },
    proxyHandler
  );

  islandElement.island = island;

  Object.entries(island.expressions).forEach(([expression, runtime]) =>
    initExpression(island, expression, runtime)
  );

  //  Object.entries(island.nodes).forEach((node) => initNode(islandElement, node));
}

export default function initIslands(islands) {
  document.islands = islands;
  document.addEventListener("DOMContentLoaded", () => {
    Object.entries(islands).forEach(initIsland);
  });
}

window.closestIsland = function closestIsland(element) {
  while (element) {
    if (element.island) {
      return element.state;
    }
    element = element.parentNode;
  }
};
