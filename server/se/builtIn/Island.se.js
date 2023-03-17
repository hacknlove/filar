const vm = require("vm");
const { DOMParser } = require("linkedom");
const parser = new DOMParser();
const { getRoot } = require("../../tree/getRoot");

let lastIslandId = 0;

async function addIslandRuntime(root) {
  if (root.querySelector('script[src="/_/island.mjs"]')) {
    return
  }

  const container = root.head || root.body || root.querySelector("head") || root.querySelector("body") || root;


    const islandRuntimeScript = parser.parseFromString(
      `<script type="module" src="/_/island.mjs"> </script>`
    ).firstElementChild;

    container.appendChild(islandRuntimeScript);
}

async function processCustomElement(element, context) {
  const root = getRoot(element);

  const attributes = element.getAttributeNames();
  const currentIslandId = `i-${lastIslandId++}`;

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

  element.parentNode.classList.add("island");

  const newContextScript = parser.parseFromString(
    `<script id=${currentIslandId}> </script>`
  ).firstElementChild;
  const content = 
  newContextScript.innerHTML = `(e=>{e.island=${JSON.stringify(
    state
  )};e.external=${JSON.stringify(external)}})(document.currentScript.parentNode)`

  element.parentNode.insertBefore(newContextScript, element);
  element.parentNode.island = state;
  element.remove();

  addIslandRuntime(root);
}

exports.processCustomElement = processCustomElement;
