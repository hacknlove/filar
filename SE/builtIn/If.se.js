const vm = require("vm");
const { childrenIterator } = require("../../helpers/childrenIterator");

async function processCustomElement(element, context, processAllElements) {
  const key = element.getAttribute("key");
  if (key && !context[key]) {
    element.remove();
    return;
  }

  const condition = element.getAttribute("condition");

  if (condition) {
    if (!vm.runInNewContext(condition, context)) {
      element.remove();
      return;
    }
  }

  await processAllElements(element, context);

  for (const child of childrenIterator(element)) {
    element.parentNode.insertBefore(child, element);
  }

  element.remove();
}

exports.processCustomElement = processCustomElement;
