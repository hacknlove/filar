const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const { join } = require("path");
const liveReloadServer = livereload.createServer();

liveReloadServer.watch(join(process.cwd()));

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

exports.liveReload = connectLiveReload();
