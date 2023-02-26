const vm = require("vm");

const { childrenIterator } = require("../../common/childrenIterator");

async function processCustomElement(element, context, processAllElements) {
  const key = element.getAttribute("key");
  const iterator = element.getAttribute("of");
  const filter = element.getAttribute("filter");

  if (!iterator || !key) {
    element.remove();
    return;
  }

  const children = Array.from(childrenIterator(element), (child) => {
    child.remove();
    return child;
  });

  const iterable = vm.runInNewContext(iterator, context);

  for (const item of iterable) {
    const newContext = { ...context, [key]: item };

    if (filter && !vm.runInNewContext(filter, newContext)) {
      continue;
    }

    const div = element.ownerDocument.createElement("div");

    for (const child of children) {
      const newChild = child.cloneNode(true);
      div.appendChild(newChild);
    }
    await processAllElements(div, newContext);
    for (const newChild of childrenIterator(div)) {
      element.parentNode.insertBefore(newChild, element);
    }
  }

  element.remove();
}

exports.processCustomElement = processCustomElement;
