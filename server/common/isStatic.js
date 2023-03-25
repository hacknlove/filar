const dynamicRegex = /\[\w*\]/;

function isStatic(filePath, document) {
  return isFilePathStatic(filePath) && isDocumentStatic(document);
}

function isFilePathStatic(filePath) {
  return !dynamicRegex.test(filePath);
}

function isDocumentStatic(document) {
  return !document?.querySelector("SSR,Directive");
}

exports.isStatic = isStatic;

exports.isFilePathStatic = isFilePathStatic;
exports.isDocumentStatic = isDocumentStatic;
