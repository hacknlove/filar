const { globPattern, addOrChange } = require("../common");

const { globAsync } = require("../../common/globAsync");

async function initializeBuiltIn() {
  const from = __dirname;
  const files = await globAsync(globPattern, {
    cwd: from,
  });

  return Promise.all(
    files.map((filename) => addOrChange(`${from}/${filename}`))
  );
}

exports.initializeBuiltIn = initializeBuiltIn;
