const { globPattern, addOrChange } = require("./common");

const { globAsync } = require("../helpers/globAsync");

async function initializeCustomElements({ from }) {
  const files = await globAsync(globPattern, {
    cwd: from,
  });

  return Promise.all(
    files.map((filename) => addOrChange(`${from}/${filename}`))
  );
}

exports.initializeCustomElements = initializeCustomElements;
