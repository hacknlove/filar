const { replacePlaceholders } = require("./replacePlaceholders");

exports.processTextNode = function (node, context) {
    node.textContent = replacePlaceholders(node.textContent, context);
}
