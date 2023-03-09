const dynamicRegex = /\[\w*\]/;

function isStatic(filePath, document) {
  if (dynamicRegex.test(filePath)) {
    return false;
  }

  const ssr = document.querySelector("SSR,Directive");
  if (ssr) {
    return false;
  }
  return true;
}

exports.isStatic = isStatic;
