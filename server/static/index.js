const { globAsync } = require("../common/globAsync");
const { join, resolve } = require("path");

const { buildOne } = require("./one");

const config = require("../config");
const { copy } = require("fs-extra");

async function static() {
  const files = await globAsync("**/*.html", {
    cwd: config.from,
    ignore: "**/*.{se,ce}.html",
  });

  await Promise.all(files.map(buildOne));
  await copy(
    resolve(__dirname, "../../client/island.mjs"),
    join(config.from, config.staticDir, "/_/island.mjs")
  );
  await copy(join(config.from, "public"), join(config.from, config.staticDir));
}

exports.static = static;
