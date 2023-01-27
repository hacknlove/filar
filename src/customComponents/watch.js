const chokidar = require('chokidar');

const { globPattern, addOrChange, remove } = require("./common");

async function watchCustomComponents() {
    const watcher = chokidar.watch(globPattern, {
        ignoreInitial: false,
    });
    
    watcher.on('add', addOrChange);
    watcher.on('change', addOrChange);
    watcher.on('unlink', remove);
}

exports.watchCustomComponents = watchCustomComponents;