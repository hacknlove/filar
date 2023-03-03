const chokidar = require("chokidar");

const { globPattern, addOrChange, remove } = require("./common");

const { from } = require("../config");

async function watchServerElements(cb) {
  const watcher = chokidar.watch(globPattern, {
    cwd: from,
    ignoreInitial: true,
  });

  watcher.on("add", file => addOrChange(`${from}/${file}`).then(cb));
  watcher.on("change", file => addOrChange(`${from}/${file}`).then(cb));
  watcher.on("unlink", file => remove(`${from}/${file}`).then(cb));
}

exports.watchServerElements = watchServerElements;
