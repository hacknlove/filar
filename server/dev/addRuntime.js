const config = require("../config");
const { saveIfDifferent } = require("../common/saveIfDifferent");
const parser = new (require("linkedom").DOMParser)();

async function addRuntime(req, res, next) {
  if (!res.page) {
    return next();
  }
  if (!Object.getOwnPropertyNames(res.__islands).length) {
    return next();
  }
  const js = `import _ from"/_/island.mjs";
_(${JSON.stringify(res.__islands, null, 4)})`;

  const sha256 = require("crypto")
    .createHash("sha256")
    .update(js)
    .digest("hex", "hex");

  const container =
    res.page.head ||
    res.page.body ||
    res.page.querySelector("head") ||
    res.page.querySelector("body") ||
    res.page;

  const islandRuntimeScript = parser.parseFromString(
    `<script type="module" src="/${sha256}.mjs"> </script>`
  ).firstElementChild;

  container.appendChild(islandRuntimeScript);

  await saveIfDifferent(`${config.from}/.dev/${sha256}.mjs`, js);
  next();
}

exports.addRuntime = addRuntime;
