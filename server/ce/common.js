const { readFile } = require("fs-extra");
const { DOMParser } = require("linkedom");
const { isAModule } = require("../common/isAModule");

const parser = new DOMParser();

const extractElementNameRegExp = /(?<elementName>([a-z]+-)+[a-z]+)\.ce\.html$/;

const ClientElementsMap = new Map();

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

  const jsPath = filePath.replace(/\.ce\.html$/, ".ce.mjs");
  ClientElementsMap.set(elementName, {
    dom: parser.parseFromString(`<div>${await readFile(filePath, "utf8")}</div`)
      .firstChild,
    js: isAModule(jsPath) && jsPath,
  });
}

function remove(filePath) {
  const elementName = getElementName(filePath);

  ClientElementsMap.delete(elementName);
  return Promise.resolve();
}

const ClientElements = new Proxy(ClientElementsMap, {
  get(target, name) {
    if (!target.has(name)) {
      throw new Error("Custom element not found", {
        cause: {
          name,
        },
      });
    }

    const { js, dom } = target.get(name);

    return {
      js,
      dom: dom.cloneNode(true),
    };
  },
});

module.exports = {
  globPattern: "**/*.ce.html",
  ClientElements,
  addOrChange,
  remove,
  ClientElementsMap,
};
