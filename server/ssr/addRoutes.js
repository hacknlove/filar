const config = require("../config");
const { resolve } = require("path");
const { addRoute } = require("./addRoute");
const { globAsync } = require("../common/globAsync");

const { sortAndMapRoutes } = require("./sortAndMapRoutes");
const { loadPage } = require("./pages");

async function addRoutes(app) {
  const files = await globAsync("**/*.html", {
    cwd: resolve(config.from, ".build", "ssr"),
  });

  const waitForPreload = Promise.all(files.map(loadPage));

  const routes = sortAndMapRoutes(files);

  for (const route of routes) {
    addRoute(app, route);
  }

  await waitForPreload;
}

exports.addRoutes = addRoutes;
