const config = require("../config");

const express = require("express");
const app = express();

const { join } = require("path");
const { context } = require("./context");

const { addRoutes } = require("./addRoutes");

async function serve() {
  app.use(context);

  if (config.middleware) {
    app.use(config.middleware);
  }

  if (config.router) {
    config.router(app);
  }

  app.use(express.static(join(config.from, "public")));
  app.use(express.static(join(config.from, ".build", "static")));

  await addRoutes(app);

  if (config.fallback) {
    app.use(config.fallback);
  }

  app.listen(3000, () => {
    console.info("Server listening on port 3000!");
  });
}
exports.serve = serve;
