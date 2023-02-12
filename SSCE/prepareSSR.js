const { DOMParser } = require("linkedom");
const parser = new DOMParser();

const emptyScript = parser.parseFromString(
  "<script class='ssr' type='application/json'></script>"
).firstChild;

exports.prepareSSR = function prepareSSR(node, context) {
  if (node.firstElementChild?.tagName === "script") {
    if (node.firstChild.classList.has("ssr")) {
      return;
    }
  }
  const newContextScript = emptyScript.cloneNode(true);

  newContextScript.innerHTML = JSON.stringify(context);

  node.prepend(newContextScript);
};
