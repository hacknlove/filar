const { join } = require("path");
const parser = new (require("linkedom").DOMParser)();

const config = require("../config");
const { readFile } = require("fs-extra");
const { getStaticContext } = require("../build/getStaticContext");
const { processAllElements } = require("../tree/processAllElements");

const autoRefreshScript = parser.parseFromString(`
    <script src="/_/autorefresh.js"> </script>
`).firstElementChild;

async function prebuild(filePath, __islands) {
  const fullFilePath = join(config.from, filePath);
  const html = await readFile(fullFilePath, "utf8");
  const document = parser.parseFromString(html).firstElementChild;
  const context = await getStaticContext(fullFilePath);
  context.__islands = __islands || {};
  await processAllElements(document, context);
  document.querySelector("head,body").appendChild(autoRefreshScript);

  return document;
}

exports.prebuild = prebuild;
