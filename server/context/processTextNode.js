const {
  replaceIslandPlaceholders,
  findIsland,
  getTextChildNumber,
} = require("./replaceIslandPlaceholders");
const { replaceStaticPlaceholders } = require("./replaceStaticPlaceholders");

function processTextNode(node, context) {
  const island = findIsland(node, context);
  node.textContent = replaceStaticPlaceholders({
    text: node.textContent,
    context,
    island: island?.state,
  });

  if (!island) return;

  const childNumber = getTextChildNumber(node);

  replaceIslandPlaceholders({
    node,
    text: node.textContent,
    island,
    attribute: `t-${childNumber}`,
  });
}

exports.processTextNode = processTextNode;

