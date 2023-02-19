const { globPattern, addOrChange } = require("./common");

const { globAsync } = require("../helpers/globAsync");
const { join } = require("path");

async function initializeBuiltInElements() {
  const from = join(__dirname, "./builtInElements");
  const files = await globAsync(globPattern, {
    cwd: from,
  });

  return Promise.all(
    files.map((filename) => addOrChange(`${from}/${filename}`))
  );
}

exports.initializeBuiltInElements = initializeBuiltInElements;
