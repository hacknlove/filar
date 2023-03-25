const config = require("../config");
const parser = new (require("linkedom").DOMParser)();
const { createHash } = require("crypto");
const { saveIfDifferent } = require("./saveIfDifferent");
const { join } = require("path");

async function addRuntime(document, context) {
  if (!Object.getOwnPropertyNames(context.__islands).length) {
    return;
  }

  const js = `import _ from"/_/island.mjs";
      _(${JSON.stringify(context.__islands, null, config.dev && 4)})`;

  const container =
    document.head ||
    document.body ||
    document.querySelector("head") ||
    document.querySelector("body") ||
    document;

  const sha256 = createHash("sha256").update(js).digest("hex", "hex");

  const islandRuntimeScript = parser.parseFromString(
    `<script type="module" src="/${sha256}.mjs"> </script>`
  ).firstElementChild;

  container.appendChild(islandRuntimeScript);
  return saveIfDifferent(
    join(config.from, config.staticDir, `${sha256}.mjs`),
    js
  );
}

exports.addRuntime = addRuntime;
