const glob = require('glob');
const { readFile } = require('fs-extra');
const { promisify } = require('util');

const globAsync = promisify(glob);

const extractComponentNameRegExp = /(?<componentName>[a-z]+-[a-z]+).component.html$/;

const customComponents = new Map();

async function initializeCustomComponents() {
    const files = await globAsync('**/*.component.html');

    for (const filePath of files) {
        const filePathParsed = filePath.match(extractComponentNameRegExp);

        if (!filePathParsed) {
            console.warn(`File ${filePath} does not match the component naming convention`);
            continue;
        }

        customComponents.set(filePathParsed.groups.componentName, await readFile(filePath, 'utf8'))
    }
}

exports.initializeCustomComponents = initializeCustomComponents;

exports.customComponents = new Proxy(customComponents, {
    get(target, name) {
        name = name.toLocaleLowerCase();
        console.log(name)
        if (!target.has(name)) {
            return `<!-- ${name} does not exists -->`;
        }

        return target.get(name);
    }
});

exports.__test__ = {
    customComponentsMap: customComponents
};