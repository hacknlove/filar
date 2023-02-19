const { replaceStaticPlaceholders } = require("./replaceStaticPlaceholders");

exports.processNodeAttributes = function processNodeAttributes(node, context) {
  for (const attr of node.getAttributeNames()) {
    node.setAttribute(
      attr,
      replaceStaticPlaceholders({
        text: node.getAttribute(attr),
        context,
      })
    );
  }
};
