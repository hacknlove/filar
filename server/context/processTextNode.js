const { replaceIslandPlaceholders } = require("./replaceIslandPlaceholders");
const { replaceStaticPlaceholders } = require("./replaceStaticPlaceholders");

function getTextChildNumber(node) {
  let i = 0;
  for (; (node = node.previousSibling); node.nodeType === 3 && i++);
  return i;
}

function findIsland(node, context) {
  while (node) {
    if (context.__islands[node.id]) {
      return context.__islands[node.id];
    }
    node = node.parentNode;
  }
  return null;
}

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

exports.__test__ = {
  getTextChildNumber,
  findIsland,
};
