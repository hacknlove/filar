const { readFile } = require("fs-extra");
const { DOMParser } = require("linkedom");

const parser = new DOMParser();

const extractElementNameRegExp = /(?<elementName>([A-Z][a-z]+)+)\.se\.(html|js)$/;

const customElementsMap = new Map();

const emptyComment = parser.parseFromString("<!-- -->").firstChild;

const getElementName = (filePath) => {
  const filePathParsed = filePath.match(extractElementNameRegExp);

  if (!filePathParsed) {
    console.warn(
      `File ${filePath} does not match the element naming convention`
    );
    return;
  }

  return filePathParsed.groups.elementName;
}

async function addOrChange(filePath) {
  const elementName = getElementName(filePath);

  if (!elementName) {
    return;
  }

  if (filePath.endsWith(".js")) {
    customElementsMap.set(elementName, require(filePath));
    return;
  }

  customElementsMap.set(
    elementName,
    parser.parseFromString(await readFile(filePath, "utf8")).firstChild
  );
}

function remove(filePath) {
  const elementName = getElementName(filePath);

  if (!elementName) {
    return;
  }

  customElementsMap.delete(elementName);
}

const customElements = new Proxy(customElementsMap, {
  get(target, name) {
    if (!target.has(name)) {
      const response = emptyComment.cloneNode(true);
      response.textContent = `${name} does not exists`;
      return response;
    }

    const element = target.get(name);

    if (element.cloneNode) {
      return element.cloneNode(true);
    }

    if (element.processCustomElement) {
      return element;
    }

    const response = emptyComment.cloneNode(true);
    response.textContent = `${name} is not a valid custom element`;
    return response;
  },
});

module.exports = {
  globPattern: "**/*.sc.html",
  customElements,
  addOrChange,
  remove,
  customElementsMap
}