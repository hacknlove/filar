const { join } = require("path");
const parser = new (require("linkedom").DOMParser)();

const config = require("../config");
const { readFile } = require("fs-extra");
const { getStaticContext } = require("../common/getStaticContext");
const { processAllElements } = require("../tree/processAllElements");

const autoRefreshScript = parser.parseFromString(`
    <script src="/_/autorefresh.js"> </script>
`).firstElementChild;

async function prebuild(filePath, res) {
  const fullFilePath = join(config.from, filePath);
  const html = await readFile(fullFilePath, "utf8");
  const document = parser.parseFromString(html).firstElementChild;
  const context = await getStaticContext(fullFilePath);
  context.__islands = res.__islands;
  context.__ce = res.__ce;
  context.__promises = res.__promises;
  await processAllElements(document, context);
  document.querySelector("head,body").appendChild(autoRefreshScript);

  return document;
}

exports.prebuild = prebuild;
