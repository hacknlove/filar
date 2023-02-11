const glob = require("glob");
const { promisify } = require("util");

const { globPattern, addOrChange } = require("./common");

const globAsync = promisify(glob);

async function initializeCustomElements({ from }) {
  const files = await globAsync(globPattern, {
    cwd: from,
  });

  return Promise.all(files.map(filename => addOrChange(`${from}/${filename}`)));
}

exports.initializeCustomElements = initializeCustomElements;
