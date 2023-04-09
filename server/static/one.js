const { readFile } = require("fs-extra");
const { saveIfDifferent } = require("../common/saveIfDifferent");
const { DOMParser } = require("linkedom");
const { join } = require("path");

const { processAllElements } = require("../tree/processAllElements");
const parser = new DOMParser();

const config = require("../config");
const { getStaticContext } = require("../common/getStaticContext");
const { isFilePathStatic, isDocumentStatic } = require("../common/isStatic");
const { addRuntime } = require("../common/addRuntime");

async function buildOne(filePath) {
  if (!isFilePathStatic(filePath)) {
    console.warn(`Skipping ${filePath}, not a static file`);
    return;
  }
  console.info(`Building ${filePath}...`);
  const fullFilePath = join(config.from, filePath);
  const file = await readFile(fullFilePath, "utf8").catch((error) => ({
    error,
  }));

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
  context.__islands = {};
  context.__ce = {};

  await processAllElements(document, context);

  if (!isDocumentStatic(document)) {
    console.warn(`Skipping ${filePath}, not a static document`);
    return;
  }

  await addRuntime(document, context);

  await saveIfDifferent(
    join(config.from, ".static", filePath),
    document.toString()
  );
}

exports.buildOne = buildOne;
