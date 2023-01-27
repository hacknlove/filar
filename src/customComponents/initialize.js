const glob = require("glob");
const { promisify } = require("util");

const { globPattern, addOrChange } = require("./common");

const globAsync = promisify(glob);

async function initializeCustomComponents() {
  const files = await globAsync(globPattern);

  return Promise.all(files.map(addOrChange));
}

exports.initializeCustomComponents = initializeCustomComponents;
