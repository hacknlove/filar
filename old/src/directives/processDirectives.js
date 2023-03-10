const { childrenIterator } = require("../helpers/childrenIterator");
const { processDirective } = require("./processDirective");

function processDirectives(req, res, document) {
  for (const node of childrenIterator(document)) {
    if (!node.tagName) {
      continue;
    }
    if (!node.tagName.startsWith("filar:")) {
      return;
    }
    processDirective(req, res, node);
    node.remove();
  }
}

exports.processDirectives = processDirectives;
