const { readFile } = require("fs-extra");

const pages = {}
const { DOMParser } = require("linkedom");

const parser = new DOMParser();

async function loadPage (filePath) {
    const document = await readFile(filePath, "utf-8");

    pages[filePath] = parser.parseFromString(document).firstChild
}

async function getPage (filePath) {
    if (!pages[filePath]) {
        throw new Error("Page not found", {
            cause: {
                filePath,
            },
        });
    }

    return pages[filePath].cloneNode(true)
}

exports.loadPage = loadPage
exports.getPage = getPage