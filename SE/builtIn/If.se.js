const vm = require("vm");
const { childrenIterator } = require("../../helpers/childrenIterator");

async function processCustomElement(element, context, processAllElements) {
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
