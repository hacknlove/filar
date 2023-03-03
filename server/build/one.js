const { readFile, outputFile } = require("fs-extra");
const { DOMParser } = require("linkedom");
const { join } = require("path");

const { processAllElements } = require("../tree/processAllElements");
const parser = new DOMParser();

const { from } = require("../config");

async function buildOne(filePath) {
  console.log(`Building ${filePath}...`);
  const file = await readFile(join(from, filePath), "utf8").catch((error) => ({
    error,
  }));

  if (file.error) {
    throw new Error("HTMl file cannot be read", {
      cause: {
        from,
        filePath,
        error: file.eror,
      },
    });
  }

  const document = parser.parseFromString(file).firstElementChild;

  await processAllElements(document, { filePath });

  await outputFile(join(
    from,
    '.build',
    document.querySelector('SSR') ? 'ssr' : 'static',
    filePath), document.toString());
}

exports.buildOne = buildOne;
