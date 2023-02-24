const { globAsync } = require("../common/globAsync");

const { buildOne } = require("./one");

async function buildAll({ from, to }) {
  const files = await globAsync("**/*.html", {
    cwd: from,
    ignore: "**/*.{se,ce}.html",
  });

  return Promise.all(files.map((filePath) => buildOne({ from, to, filePath })));
}

exports.buildAll = buildAll;
