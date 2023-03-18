const { EventEmitter } = require("events").EventEmitter;

class RefreshEvents extends EventEmitter {}

const refreshEventsEmitter = new RefreshEvents();

const config = require("../config");
const chokidar = require("chokidar");

const watcher = chokidar.watch("**/*", {
  cwd: config.from,
  ignoreInitial: true,
});

watcher.on("add", () => refreshEventsEmitter.emit("refresh"));
watcher.on("change", () => refreshEventsEmitter.emit("refresh"));
watcher.on("unlink", () => refreshEventsEmitter.emit("refresh"));

async function autorefresh(req, res) {
  res.set({
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });
  res.flushHeaders();
  res.write("retry: 10000\n\n");

  function refresh() {
    res.write("data: refresh\n\n");
  }

  refreshEventsEmitter.on("refresh", refresh);

  req.on("close", () => {
    refreshEventsEmitter.removeListener("refresh", refresh);
  });
}

exports.autorefresh = autorefresh;
