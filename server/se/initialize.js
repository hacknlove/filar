const { globPattern, addOrChange } = require("./common");

const { globAsync } = require("../common/globAsync");

const { initializeBuiltIn } = require("./builtIn/initializeBuiltIn");

const config = require("../config");

async function initializeServerElements() {
  const builtInPromise = initializeBuiltIn();
  const files = await globAsync(globPattern, {
    cwd: config.from,
  });

  await Promise.all(
    files.map((filename) => addOrChange(`${config.from}/${filename}`))
  );
  return builtInPromise;
}

exports.initializeServerElements = initializeServerElements;
