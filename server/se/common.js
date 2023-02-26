const { readFile } = require("fs-extra");
const { DOMParser } = require("linkedom");

const parser = new DOMParser();

const extractElementNameRegExp =
  /(?<elementName>([A-Z][a-z]+)+)\.se\.(html|js)$/;

const ServerElementsMap = new Map();

const emptyComment = parser.parseFromString("<!-- -->").firstChild;

function getElementName(filePath) {
  const filePathParsed = filePath.match(extractElementNameRegExp);

  if (!filePathParsed) {
    throw new Error("Wrong custom element name", {
      cause: {
        filePath,
      },
    });
  }

  return filePathParsed.groups.elementName;
}

async function addOrChange(filePath) {
  const elementName = getElementName(filePath);

  if (filePath.endsWith(".js")) {
    ServerElementsMap.set(elementName, require(filePath));
    return;
  }

  ServerElementsMap.set(
    elementName,
    parser.parseFromString(await readFile(filePath, "utf8")).firstChild
  );
}

function remove(filePath) {
  const elementName = getElementName(filePath);

  ServerElementsMap.delete(elementName);
}

const ServerElements = new Proxy(ServerElementsMap, {
  get(target, name) {
    if (!target.has(name)) {
      throw new Error("Custom element not found", {
        cause: {
          name,
        },
      });
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
  globPattern: "**/*.se.{html,js}",
  ServerElements,
  addOrChange,
  remove,
  ServerElementsMap,
};
