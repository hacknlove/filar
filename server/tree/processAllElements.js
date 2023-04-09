const { childrenIterator } = require("../common/childrenIterator");
const { processTextNode } = require("../context/processTextNode");
const { prepareSSR } = require("../build/prepareSSR");
const { processNodeAttributes } = require("../context/processNodeAttributes");
const { getNewContext } = require("../context/getNewContext");
const { processServerElement } = require("../se/processServerElement");
const { processClientElement } = require("../ce/processClientElement");
const { islandAttributes } = require("./islandAttributes");

const isServerElementRegex = /^([A-Z][a-z]+)+$/;
const isClientElementRegex = /^([a-z]+-)+[a-z]+$/;

async function processAllElements(element, context = {}) {
  for (const node of childrenIterator(element)) {
    if (node.nodeType === 3) {
      try {
        processTextNode(node, context);
      } catch (error) {
        throw new Error("Error while processing text node", {
          cause: {
            ...error.cause,
            element: element.parentNode?.tagName,
          },
        });
      }
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
    await islandAttributes(node, context);

    if (isServerElementRegex.test(node.tagName)) {
      await processServerElement(node, newContext, processAllElements);
    } else if (isClientElementRegex.test(node.tagName)) {
      await processClientElement(node, newContext, processAllElements);
    }
    await processAllElements(node, newContext);
  }
}

exports.processAllElements = processAllElements;
