const { replaceIslandPlaceholders } = require("./replaceIslandPlaceholders");
const { replaceStaticPlaceholders } = require("./replaceStaticPlaceholders");

function getChildNumber (node) {
  let i = 0;
  for(;(node = node.previousSibling);i++);
  return i;
}

function findIsland (node) {
  while (node && !node.island) {
    node = node.parentNode;
  }
  return node?.island;
}

exports.processTextNode = function (node, context) {
  const island = findIsland(node);
  node.textContent = replaceStaticPlaceholders({
    text: node.textContent,
    context,
    island
  });

  if (!island) return;

  const childNumber = getChildNumber(node);

  const {
    text,
    serialized
  } = replaceIslandPlaceholders({
    text: node.textContent,
    island,
    childNumber
  });

  if (!serialized) {
    return
  }

  node.textContent = text;
  const previousSerialized = node.parentNode.serialized ?? [];
  previousSerialized.push(serialized);
  node.parentNode.serialized = previousSerialized;

  node.parentNode.setAttribute("data-island", JSON.stringify(previousSerialized));
};
