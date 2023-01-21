const glob = require('glob');
const { readFile } = require('fs-extra');
const { promisify } = require('util');

const globAsync = promisify(glob);

const extractComponentNameRegExp = /(?<componentName>[^/]+-[^/]+).component.html$/;

const customComponens = new Map();

async function customComponentsInit() {
    const files = await globAsync('**/*.component.html');

    for (const filePath of files) {
        const filePathParsed = filePath.match(extractComponentNameRegExp);

        if (!filePathParsed) {
            console.warn(`File ${filePath} does not match the component naming convention`);
            continue;
        }

        customComponens.set(filePathParsed.groups.componentName, await readFile(filePath, 'utf8'))
    }
}

exports.customComponentsInit = customComponentsInit;

exports.customComponents = new Proxy(customComponens, {
    get(target, name) {
        if (!target.has(name)) {
            return `<!-- ${name} does not exists -->`;
        }

        return target.get(name);
    }
});