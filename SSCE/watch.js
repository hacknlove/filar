const chokidar = require('chokidar');

const { globPattern, addOrChange, remove } = require("./common");

async function watchCustomElements() {
    const watcher = chokidar.watch(globPattern, {
        ignoreInitial: false,
    });
    
    watcher.on('add', addOrChange);
    watcher.on('change', addOrChange);
    watcher.on('unlink', remove);
}

exports.watchCustomElements = watchCustomElements;