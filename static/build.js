const { readFile, outputFile } = require("fs-extra");
const { DOMParser } = require("linkedom");
const { join } = require("path");

const {
  processAllElements,
} = require("../SSCE/processAllElements");
const parser = new DOMParser();

async function build({ from, to, filePath }) {
  console.log(`Building ${filePath}...`);
  const file = await readFile(join(from, filePath), "utf8").catch((error) => ({
    error,
  }));

  if (file.error) {
    console.error(file.error);
    return;
  }

  const document = parser.parseFromString(file).firstElementChild;

  await processAllElements(document);

  await outputFile(join(to, filePath), document.toString());
}

exports.build = build;
