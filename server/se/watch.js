const chokidar = require("chokidar");

const { globPattern, addOrChange, remove } = require("./common");

const config = require("../config");

async function watchServerElements(cb) {
  const watcher = chokidar.watch(globPattern, {
    cwd: config.from,
    ignoreInitial: true,
  });

  watcher.on("add", (file) => addOrChange(`${config.from}/${file}`).then(cb));
  watcher.on("change", (file) =>
    addOrChange(`${config.from}/${file}`).then(cb)
  );
  watcher.on("unlink", (file) => remove(`${config.from}/${file}`).then(cb));
}

exports.watchServerElements = watchServerElements;
