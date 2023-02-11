
const { childrenIterator } = require("../helpers/childrenIterator");
const { processTextNode } = require("./processTextNode");
const { prepareSSR } = require("./prepareSSR");
const { processNodeAttributes } = require("./processNodeAttributes");
const { getNewContext } = require("./getNewContext");
const { processCustomElement } = require("./processCustomElement");

const isCustomComponentRegex = /^([A-Z][a-z]+)+$/;


async function processAllElements(element, context = {}) {  
  for (const node of childrenIterator(element)) {
    if (node.nodeType === 3) {
      processTextNode(node, context);
      continue;
    }
    
    if (!node.tagName ) {
      continue;
    }

    if (node.tagName === "SSR") {
      prepareSSR(node, context);
      continue
    }

    processNodeAttributes(node, context);

    const newContext = getNewContext(node, context)

    if (isCustomComponentRegex.test(node.tagName)) {
      await processCustomElement(node, newContext, processAllElements);
    }
    await processAllElements(node, newContext);
  }
}

exports.processAllElements = processAllElements;
