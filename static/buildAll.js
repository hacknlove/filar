const { promisify } = require("util");
const globAsync = promisify(require("glob"));

const { build } = require("./build");

async function buildAll({ from, to }) {
  const files = await globAsync("**/*.html", {
    cwd: from,
    ignore: "**/*.{se,sc}.html",
  });

  return Promise.all(files.map((filePath) => build({ from, to, filePath })));
}

exports.buildAll = buildAll;
