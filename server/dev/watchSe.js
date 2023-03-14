const chokidar = require("chokidar");

const { globPattern, addOrChange, remove } = require("../se/common");

const config = require("../config");

async function watchServerElements(cb) {
  const watcher = chokidar.watch(globPattern, {
    cwd: config.from,
    ignoreInitial: true,
  });

  watcher.on("add", (file) => addOrChange(file).then(cb));
  watcher.on("change", (file) =>
    addOrChange(file).then(cb)
  );
  watcher.on("unlink", (file) => remove(file).then(cb));
}

exports.watchServerElements = watchServerElements;
