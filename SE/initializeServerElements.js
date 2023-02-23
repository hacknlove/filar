const { globPattern, addOrChange } = require("./common");

const { globAsync } = require("../helpers/globAsync");

const { initializeBuiltIn } = require("./builtIn/initializeBuiltIn");

async function initializeServerElements({ from }) {
  const builtInPromise = initializeBuiltIn();
  const files = await globAsync(globPattern, {
    cwd: from,
  });

  await Promise.all(
    files.map((filename) => addOrChange(`${from}/${filename}`))
  );
  return builtInPromise;
}

exports.initializeServerElements = initializeServerElements;
