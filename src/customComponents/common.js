const { readFile } = require("fs-extra");

const extractComponentNameRegExp = /(?<componentName>[a-z]+-[a-z]+).component.html$/;

const customComponentsMap = new Map();

const getComponentName = (filePath) => {
  const filePathParsed = filePath.match(extractComponentNameRegExp);

  if (!filePathParsed) {
    console.warn(
      `File ${filePath} does not match the component naming convention`
    );
    return;
  }

  return filePathParsed.groups.componentName;
}

async function addOrChange(filePath) {
  const componentName = getComponentName(filePath);

  if (!componentName) {
    return;
  }

  customComponentsMap.set(
    componentName,
    await readFile(filePath, "utf8")
  );
}

function remove(filePath) {
  const componentName = getComponentName(filePath);

  if (!componentName) {
    return;
  }

  customComponentsMap.delete(componentName);
}

const customComponents = new Proxy(customComponentsMap, {
  get(target, name) {
    name = name.toLocaleLowerCase();
    if (!target.has(name)) {
      return `<!-- ${name} does not exists -->`;
    }

    return target.get(name);
  },
});

module.exports = {
  globPattern: "**/*.component.html",
  customComponents,
  addOrChange,
  remove,
  customComponentsMap
}