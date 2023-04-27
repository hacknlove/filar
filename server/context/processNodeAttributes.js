const { replaceStaticPlaceholders } = require("./replaceStaticPlaceholders");
const { replaceIslandPlaceholders } = require("./replaceIslandPlaceholders");
const { findIsland } = require("../Island/findIsland");

exports.processNodeAttributes = function processNodeAttributes(node, context) {
  const island = findIsland(node, context);

  for (const attr of node.getAttributeNames()) {
    let text = replaceStaticPlaceholders({
      text: node.getAttribute(attr),
      context,
    });
    if (island) {
      replaceIslandPlaceholders({
        node,
        text,
        island,
        attribute: attr,
        context,
      });
      continue;
    }
    node.setAttribute(
      attr,
      replaceStaticPlaceholders({
        node,
        text: node.getAttribute(attr),
        context,
      })
    );
  }
};
