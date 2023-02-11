const { readFile, outputFile } = require("fs-extra");
const { DOMParser } = require("linkedom");
const { join } = require("path");

const {
  processCustomComponents,
} = require("../src/customComponents/processAll");
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

  const document = parser.parseFromString(file).firstChild;

  await processCustomComponents(document);

  await outputFile(join(to, filePath), document.toString());
}

exports.build = build;
