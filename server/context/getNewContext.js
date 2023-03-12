const vm = require("node:vm");

const isCamelCaseRegex = /^([A-Z][a-z]*)+[a-z][A-Z]*$/;

exports.getNewContext = function getNewContext(node, context) {
  const newContext = Object.create(context);

  for (const attr of node.getAttributeNames()) {
    if (!isCamelCaseRegex.test(attr)) {
      continue;
    }
    const value = node.getAttribute(attr);
    node.removeAttribute(attr);

    try {
      newContext[attr] = vm.runInNewContext(value, context);
    } catch (error) {
      throw new Error("Wrong context expression", {
        cause: {
          attr,
          value,
          context,
          error,
        },
      });
    }
  }

  return newContext;
};
