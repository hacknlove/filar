let liveIslandId = 0;
let liveNodeId = 0;

const contextRegexp = /{\((.+?)\)}/g;

function getTextNode(elementNode, number) {
  for (const child of elementNode.childNodes) {
    if (child.nodeType === Node.TEXT_NODE && number-- === 0) return child;
  }
  const textNode = document.createTextNode("");
  elementNode.appendChild(textNode);
  return textNode;
}

function hasAttribute(node, attribute) {
  if (!attribute.startsWith("t-")) {
    return node.hasAttribute(attribute);
  }
  let number = parseInt(attribute.slice(2));
  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE && number-- === 0) return true;
  }
  return false;
}

function getTextChildNumber(node) {
  let i = 0;
  for (; (node = node.previousSibling); node.nodeType === 3 && i++);
  return i;
}

function getOldText(node, attribute) {
  if (attribute.startsWith("t-")) {
    return getTextNode(node, attribute.slice(2)).textContent;
  } else {
    return node.getAttribute(attribute);
  }
}

function setNewText(node, attribute, newText) {
  if (attribute.startsWith("t-")) {
    getTextNode(node, attribute.slice(2)).textContent = newText;
  } else {
    node.setAttribute(attribute, newText);
  }
}

function fullState(node) {
  let state = {};
  while (node) {
    if (node.island) {
      state = Object.assign({}, node.island.raw.state, state);
    }
    node = node.parentNode;
  }
  return state;
}

function before__(list, name) {
  for (const attribute of list) {
    if (attribute === "__") {
      return false;
    }
    if (attribute === name) {
      return true;
    }
  }
  return false;
}

const proxyHandler = {
  get: (target, key, receiver) => {
    const value = Reflect.get(target.raw.state, key, receiver);
    if (!value) {
      return value;
    }
    if (typeof value === "object") {
      return new Proxy(
        {
          raw: {
            state: target.raw.state[key],
          },
          id: target.id,
        },
        proxyHandler
      );
    }
    return value;
  },
  set: (target, key, value) => {
    Reflect.set(target.raw.state, key, value, target.raw.state);

    document.islands[target.id].refresh();
    return true;
  },
};

class Expression {
  constructor(island, expression) {
    this.raw = island.raw.expressions[expression];
    this.state = island.state;
    this.evaluate = island.evaluate.bind(island);
    this.offsets = island.raw.offsets;
    this.expression = expression;
  }

  getNewText(oldText, newValue, offset) {
    return (
      oldText.slice(0, offset) +
      newValue +
      oldText.slice(offset + this.raw.value.length)
    );
  }

  get value() {
    return this.raw.value;
  }
  set value(newValue) {
    if (newValue === this.raw.value) {
      return;
    }

    for (const [nodeId, attribute, replaceIndex, attributeVersion] of this.raw
      .replacements) {
      const node = document.getElementById(nodeId);
      if (!node) {
        continue;
      }
      if (node.attributesVersion?.[attribute] !== attributeVersion) {
        continue;
      }
      const offset = this.offsets[nodeId][attribute][replaceIndex];
      const oldText = getOldText(node, attribute);

      const newText =
        oldText.slice(0, offset) +
        newValue +
        oldText.slice(offset + this.raw.value.length);

      if (newValue.length !== this.raw.value.length) {
        for (let i = replaceIndex + 1; i < this.raw.replacements.length; i++) {
          this.offsets[nodeId][attribute][i] +=
            newValue.length - this.raw.value.length;
        }
      }

      setNewText(node, attribute, newText);
    }

    this.raw.value = newValue;
  }
  refresh() {
    this.value = this.evaluate(this.expression).toString();
  }
}

class Island {
  constructor(id, raw) {
    this.refreshTimeout = null;
    this.debounceTime = 1;
    this.expressions = {};
    this.state = new Proxy(this, proxyHandler);

    this.id = id;
    this.raw = raw;

    for (const expression in raw.expressions) {
      this.expressions[expression] = new Expression(this, expression);
    }

    this.root.dispatchEvent(new CustomEvent("island-ready"));
  }

  get root() {
    return document.getElementById(this.id);
  }

  addIsland(node) {
    const dettached = !this.root.contains(node);
    if (dettached && node.isConnected) {
      node.remove();
    }
    initializeIsland(node, {
      expressions: {},
      offsets: {},
      live: {},
      state: dettached ? Object.create(fullState(this.root)) : {},
    });

    if (!dettached) {
      const tempState = node.island.raw.state;
      const actualState = {};
      for (const key in Object.keys(tempState)) {
        actualState[key] = tempState[key];
      }
      node.island.raw.state = actualState;
    }
  }

  processNode(node) {
    if (node.hasAttribute("__")) {
      return this.addIsland(node);
    }
    for (const attribute of node.getAttributeNames()) {
      this.replacePlaceholder(node.getAttribute(attribute), {
        node,
        attribute,
      });
    }
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        this.replacePlaceholder(child.textContent, {
          node,
          attribute: `t-${getTextChildNumber(child)}`,
        });
      } else {
        this.processNode(child);
      }
    }
  }

  refreshOnParent(parentIsland) {
    if (!this.isIslandAncestor(parentIsland)) {
      return;
    }
    for (const attribute in this.raw.live) {
      const value = this.evaluate(this.raw.live[attribute]);

      if (value !== this.raw.state[attribute]) {
        this.raw.state[attribute] = value;
      }
    }
    this.refresh(true, true);
  }

  refresh(now, skipEvent) {
    if (!now) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = setTimeout(
        this.refresh.bind(this, true),
        this.debounceTime
      );
      return;
    }
    Object.values(this.expressions).forEach((expression) =>
      expression.refresh()
    );
    if (!skipEvent) {
      this.root.dispatchEvent(new CustomEvent("state"));
      refreshChildren(this.root);
    }
  }

  evaluate(expression, name) {
    const state = fullState(this.root);

    const fn = new Function(
      ["_state"],
      `\
        const { ${Object.keys(state).join(",")} } = _state;
        return ${expression};\n`
    );
    try {
      if (name) {
        this.raw.live[name] = expression;
      }
      return fn(state);
    } catch {
      if (name) {
        delete this.raw.live[name];
      }
      return expression;
    }
  }

  replacePlaceholder(text, { node, attribute }) {
    if (!contextRegexp.test(text)) {
      return;
    }
    const expressions = this.raw.expressions;

    node.id ??= `L-${liveNodeId++}`;

    node.attributesVersion ??= {
      [attribute]: 0,
    };
    const attributeVersion = ++node.attributesVersion[attribute];

    this.raw.offsets[node.id] ??= {};
    this.raw.offsets[node.id][attribute] = [];

    const attributeOffsets = this.raw.offsets[node.id][attribute];

    let offset = 0;
    let replaceIndex = 0;

    const newText = text.replace(contextRegexp, (match, expression, index) => {
      let replacement = this.raw.expressions[expression]?.value;

      if (expressions[expression] === undefined) {
        replacement = this.evaluate(expression);
        expressions[expression] = {
          value: replacement,
          replacements: [],
        };
        this.expressions[expression] = new Expression(this, expression);
      }
      attributeOffsets.push(index + offset);
      expressions[expression].replacements.unshift([
        node.id,
        attribute,
        replaceIndex++,
        attributeVersion,
      ]);

      offset += replacement.length - match.length;
      return replacement;
    });

    if (attribute.startsWith("t-")) {
      const textNode = getTextNode(node, parseInt(attribute.substring(2)));
      textNode.textContent = newText;
    } else {
      node.setAttribute(attribute, newText);
    }
  }

  isIslandAncestor(parentIslandElement) {
    let me = this.root.parentNode;
    while (me) {
      if (me === parentIslandElement) {
        return true;
      }
      me = me.parentNode;
    }
  }

  observeSelf() {
    if (this.selfObserver) {
      return;
    }
    const root = this.root;
    this.selfObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const name = mutation.attributeName;
        if (name === "class") {
          continue;
        }
        if (
          root.hasAttribute(name) &&
          before__(root.getAttributeNames(), name)
        ) {
          continue;
        }
        const expression = root.getAttribute(name);
        this.state[name] = this.evaluate(expression, name);
      }
    });

    this.selfObserver.observe(root, {
      subtree: false,
      childList: false,
      attributes: true,
    });
  }

  observeChildren() {
    if (this.childrenObserver) {
      return;
    }
    const root = this.root;
    this.childrenObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (window.closestIsland(mutation.target) !== this.state) {
          continue;
        }
        switch (mutation.type) {
          case "attributes":
            if (mutation.target === root) {
              continue;
            }

            this.replacePlaceholder(
              mutation.target.getAttribute(mutation.attributeName),
              {
                node: mutation.target,
                attribute: mutation.attributeName,
              }
            );
            break;
          case "childList":
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.TEXT_NODE) {
                this.replacePlaceholder(node.textContent, {
                  node: node.parentNode,
                  attribute: `t-${getTextChildNumber(node)}`,
                });
              } else {
                this.processNode(node);
              }
            }
        }
      }
    });

    this.childrenObserver.observe(root, {
      subtree: true,
      characterData: true,
      childList: true,
      attributes: true,
    });
  }

  GC() {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => GC(this.id));
    } else {
      setTimeout(() => GC(this.id), 1000);
    }
  }
}

export function initializeIsland(
  node,
  islandData = { expressions: {}, state: {}, live: {}, offsets: {} }
) {
  node.id ??= `I-${liveIslandId++}`;
  node.island = new Island(node.id, islandData);
  document.islands[node.id] = node.island;
}

export default function initIslands(islands) {
  document.islands = {};

  document.addEventListener("DOMContentLoaded", () => {
    for (const islandId in islands) {
      const node = document.getElementById(islandId);
      if (!node) {
        console.warn(`Island ${islandId} not found`);
        return;
      }
      initializeIsland(node, islands[islandId]);
    }
    document.dispatchEvent(new CustomEvent("islands-ready"));
  });
}

document.addEventListener("islands-ready", () => {
  // Observer
  const observer = new MutationObserver(
    (mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "childList") {
          continue;
        }
        for (const node of mutation.removedNodes) {
          if (!node.island) {
            continue;
          }
          for (const [islandId, eventHandler] of node.island.events) {
            document
              .getElementById(islandId)
              ?.removeEventListener("state", eventHandler);
          }
        }
      }
    },
    { subtree: true, childList: true }
  );

  observer.observe(document.body, { subtree: true, childList: true });
});

window.closestIsland = function closestIsland(element) {
  while (element) {
    if (element.island) {
      return element.island.state;
    }
    element = element.parentNode;
  }
};

function refreshChildren(parentIslandElement) {
  for (const islandId in document.islands) {
    const island = document.islands[islandId];
    island.refreshOnParent(parentIslandElement);
  }
}

function GC(id) {
  if (!id) {
    for (const islandId in document.islands) {
      GC(islandId);
    }
  }

  const island = document.islands[id];
  if (!island) {
    return;
  }

  if (!island.root) {
    delete document.islands[id];
    return;
  }

  const raw = island.raw;

  for (const nodeId in raw.offsets) {
    const node = document.getElementById(nodeId);
    if (!node) {
      delete raw.offsets[nodeId];
      continue;
    }
    for (const attribute in raw.offsets[nodeId]) {
      if (!node.hasAttribute(attribute)) {
        delete raw.offsets[nodeId][attribute];
      }
    }
  }
  for (const expression in raw.expressions) {
    const replacements = raw.expressions[expression].replacements;

    if (!replacements.length) {
      delete raw.expressions[expression];
    }

    raw.expressions[expression].replacements = raw.expressions[
      expression
    ].replacements.filter(([nodeId, attribute, , attributeVersion]) => {
      const node = document.getElementById(nodeId);

      if (!node) {
        return false;
      }
      if (!hasAttribute(node, attribute)) {
        return false;
      }
      if (node.attributesVersion[attribute] !== attributeVersion) {
        return false;
      }
      return true;
    });
  }
}

export const __test__ = {
  contextRegexp,
  getTextNode,
  hasAttribute,
  getTextChildNumber,
  getOldText,
  setNewText,
  fullState,
  before__,
  proxyHandler,
  Expression,
  Island,
  initializeIsland,
  refreshChildren,
  GC,
};
