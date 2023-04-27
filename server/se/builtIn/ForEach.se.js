const vm = require("vm");

const { childrenIterator } = require("../../common/childrenIterator");

async function processServerElement(node, context, processAllElements) {
  const key = node.getAttribute("key");
  const iterator = node.getAttribute("of");
  const filter = node.getAttribute("filter");

  if (!iterator || !key) {
    node.remove();
    return;
  }

  const children = Array.from(childrenIterator(node), (child) => {
    child.remove();
    return child;
  });

  const iterable = vm.runInNewContext(iterator, context);

  for (const item of iterable) {
    const newContext = Object.create(context);
    newContext[key] = item;

    if (filter && !vm.runInNewContext(filter, newContext)) {
      continue;
    }

    const div = node.ownerDocument.createElement("div");

    for (const child of children) {
      const newChild = child.cloneNode(true);
      div.appendChild(newChild);
    }
    await processAllElements(div, newContext);
    for (const newChild of childrenIterator(div)) {
      node.parentNode.insertBefore(newChild, node);
    }
  }

  node.remove();
}

exports.processServerElement = processServerElement;
