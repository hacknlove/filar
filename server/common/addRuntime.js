const config = require("../config");
const parser = new (require("linkedom").DOMParser)();
const { createHash } = require("crypto");
const { saveIfDifferent } = require("./saveIfDifferent");
const { join } = require("path");
const { copy } = require("fs-extra");

async function addRuntime(document, context) {
  if (!Object.getOwnPropertyNames(context.__islands).length) {
    return;
  }

  let js = `import _ from"/_/island.mjs"`;
  if (Object.getOwnPropertyNames(context.__ce).length) {
    js += `;import º from"/_/ce.mjs"`;
    Object.values(context.__ce).forEach((jsPath, i) => {
      const importPath = jsPath.substr(config.from.length);
      context.__promises.push(
        copy(jsPath, join(config.from, config.staticDir, importPath))
      );

      js += `;import * as º${i} from"${importPath}"`;
    });
    Object.keys(context.__ce).forEach((customElement, i) => {
      js += `;º(º${i},"${customElement}")`;
    });
  }
  js += `;_(${JSON.stringify(context.__islands, null, config.dev && 4)})`;

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
