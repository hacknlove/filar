const chokidar = require('chokidar');

const { globPattern, addOrChange, remove } = require("./common");

async function watchCustomElements({ from, to, buildAll }) {
    const watcher = chokidar.watch(globPattern, {
        cwd: from,
        ignoreInitial: true,
    });
    
    watcher.on('add', async file => {
        await addOrChange(`${from}/${file}`);
        buildAll({ from, to });
    });
    watcher.on('change', async file => {
        await addOrChange(`${from}/${file}`)
        buildAll({ from, to });
    });
    watcher.on('unlink', async file => {
        await remove(`${from}/${file}`)
        buildAll({ from, to });
    });
}

exports.watchCustomElements = watchCustomElements;