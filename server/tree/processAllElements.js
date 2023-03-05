const { childrenIterator } = require("../common/childrenIterator");
const { processTextNode } = require("../context/processTextNode");
const { prepareSSR } = require("../build/prepareSSR");
const { processNodeAttributes } = require("../context/processNodeAttributes");
const { getNewContext } = require("../context/getNewContext");
const { processCustomElement } = require("../se/processCustomElement");

const isCustomComponentRegex = /^([A-Z][a-z]+)+$/;

async function processAllElements(element, context = {}) {
  for (const node of childrenIterator(element)) {
    if (node.nodeType === 3) {
      processTextNode(node, context);
      continue;
    }

    if (!node.tagName) {
      continue;
    }

    if (node.tagName === "SSR") {
      prepareSSR(node, context);
      continue;
    }

    const newContext = getNewContext(node, context);

    processNodeAttributes(node, context);

    if (isCustomComponentRegex.test(node.tagName)) {
      await processCustomElement(node, newContext, processAllElements);
    }
    await processAllElements(node, newContext);
  }
}

exports.processAllElements = processAllElements;
