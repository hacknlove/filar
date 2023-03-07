const { readFile, outputFile } = require("fs-extra");
const { DOMParser } = require("linkedom");
const { join } = require("path");

const { processAllElements } = require("../tree/processAllElements");
const parser = new DOMParser();

const config = require("../config");
const { getStaticContext } = require("./getStaticContext");

async function buildOne(filePath) {
  console.log(`Building ${filePath}...`);
  const fullFilePath = join(config.from, filePath);
  const file = await readFile(fullFilePath, "utf8").catch(
    (error) => ({
      error,
    })
  );

  if (file.error) {
    throw new Error("HTMl file cannot be read", {
      cause: {
        from: config.from,
        filePath,
        error: file.eror,
      },
    });
  }

  const document = parser.parseFromString(file).firstElementChild;

  const context = await getStaticContext(fullFilePath);

  await processAllElements(document, context);

  await outputFile(
    join(
      config.from,
      ".build",
      document.querySelector("SSR") ? "ssr" : "static",
      filePath
    ),
    document.toString()
  );
}

exports.buildOne = buildOne;
