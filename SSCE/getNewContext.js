const isCamelCaseRegex = /^([A-Z][a-z]*)+[a-z][A-Z]*$/;

exports.getNewContext = function getNewContext (node, context) {
    const newContext = { ...context };

    for (const attr of node.getAttributeNames()) {
      if (isCamelCaseRegex.test(attr)) {
        newContext[attr] = node.getAttribute(attr);
        node.removeAttribute(attr);
      }
    }

    return newContext;
}