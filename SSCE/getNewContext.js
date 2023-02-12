const vm = require('node:vm');

const isCamelCaseRegex = /^([A-Z][a-z]*)+[a-z][A-Z]*$/;

const keyRegex = /^{{(?<key>([A-Z][a-z]*)+[a-z][A-Z]*)}}$/;
const expressionValueRegex = /^{\|(?<expresion>.+?)\|}({{(.*)}}|{\|(.*)\|})?$/;

exports.getNewContext = function getNewContext (node, context) {
    const newContext = { ...context };

    for (const attr of node.getAttributeNames()) {
      if (!isCamelCaseRegex.test(attr)) {
        continue;
      }
      const value = node.getAttribute(attr);
      node.removeAttribute(attr);

      const key = value.match(keyRegex);
      if (key) {
        newContext[attr] = context[key.groups.key];
        continue;
      }

      const expressionValue = value.match(expressionValueRegex);
      if (expressionValue) {
        newContext[attr] = vm.runInNewContext(expressionValue.groups.expresion, context);
        continue;
      }

      newContext[attr] = value;
    }

    return newContext;
}