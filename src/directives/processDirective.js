
const { directives } = require('./directives');

function processDirective(req, res, node) {
    const directive = node.tagName.substring(6);

    const directiveFunction = directives[directive];

    if (!directiveFunction) {
        node.outerHTML = '<!-- Unknown directive -->';
        console.warn(`Unknown directive: ${directive}`);
        return;
    }
    directiveFunction(req, res, node);   
}

exports.processDirective = processDirective;