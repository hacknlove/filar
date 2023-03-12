const { DOMParser } = require("linkedom");
const parser = new DOMParser();

const isCamelCaseRegex = /^([A-Z][a-z]*)+[a-z][A-Z]*$/;

const emptyScript = parser.parseFromString(
  "<script class='ssr' type='application/json'></script>"
).firstChild;

exports.prepareSSR = function prepareSSR(node, context) {
  const firstElementChild = node.firstElementChild;
  if (
    firstElementChild &&
    firstElementChild?.tagName === "script" &&
    firstElementChild.classList.has("ssr")
  ) {
    return;
  }
  const newContextScript = emptyScript.cloneNode(true);

  const newContext = {};
  for (const key in context) {
    if (isCamelCaseRegex.test(key)) {
      newContext[key] = context[key];
    }
  }

  newContextScript.innerHTML = JSON.stringify(newContext);

  node.prepend(newContextScript);
};
