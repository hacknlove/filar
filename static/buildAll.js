const { globAsync } = require("../helpers/globAsync");

const { build } = require("./build");

async function buildAll({ from, to }) {
  const files = await globAsync("**/*.html", {
    cwd: from,
    ignore: "**/*.{se,ce}.html",
  });

  return Promise.all(files.map((filePath) => build({ from, to, filePath })));
}

exports.buildAll = buildAll;
