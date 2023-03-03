const { globAsync } = require("../common/globAsync");

const { buildOne } = require("./one");

const { from } = require("../config");

async function buildAll() {
  const files = await globAsync("**/*.html", {
    cwd: from,
    ignore: "**/*.{se,ce}.html",
  });

  return Promise.all(files.map(buildOne));
}

exports.buildAll = buildAll;
