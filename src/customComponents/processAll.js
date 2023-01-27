const { processCustomComponent } = require("./processOne");

async function processCustomComponents(element) {
  if (element.nextSibling) {
    processCustomComponents(element.nextSibling);
  }

  if (element.firstChild) {
    await processCustomComponents(element.firstChild);
  }

  if (!element.tagName) {
    return;
  }

  if (!element.tagName.includes("-")) {
    return;
  }

  await processCustomComponent(element);
}

exports.processCustomComponents = processCustomComponents;
