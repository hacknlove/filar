const { makeAnIsland } = require("../se/builtIn/Island.se");

function islandAttributes(node, context) {
  if (!node.hasAttribute("__")) {
    return;
  }

  const attributes = {};
  let skip = true;

  for (const attribute of node.getAttributeNames()) {
    if (attribute === "__") {
      skip = false;
      continue;
    }
    if (skip) {
      continue;
    }
    attributes[attribute] = node.getAttribute(attribute);
  }
  return makeAnIsland(node, attributes, context);
}

exports.islandAttributes = islandAttributes;
