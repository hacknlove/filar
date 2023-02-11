const { replacePlaceholders } = require("./replacePlaceholders");

exports.processNodeAttributes = function processNodeAttributes(node, context) {
  for (const attr of node.getAttributeNames()) {
    node.setAttribute(attr, replacePlaceholders(node.getAttribute(attr), context));
  }
}