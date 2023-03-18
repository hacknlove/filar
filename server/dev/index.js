const config = require("../config");

const express = require("express");
const app = express();

const { join } = require("path");
const { context } = require("./context");

const { build } = require("./build");
const { ssr } = require("./ssr");
const { addRuntime } = require("./addRuntime");

require("./watchSe").watchServerElements();

async function dev() {
  app.use(
    "/_",
    express.static(join(__dirname, "../../client"), {
      extensions: ["mjs", "js"],
    })
  );

  app.get("/_/refresh", require("./autorefresh").autorefresh);

  app.use(context);

  app.use((req, res, next) => {
    if (!config.middleware) {
      return next();
    }
    config.middleware(req, res, next);
  });

  app.use((req, res, next) => {
    if (!config.router) {
      return next();
    }

    config.router(req, res, next);
  });

  app.use(express.static(join(config.from, "public")));
  app.use(express.static(join(config.from, ".dev")));

  app.use(build);
  app.use(ssr);

  app.use((req, res, next) => {
    if (!config.postProcess) {
      return next();
    }
    config.postProcess(req, res, next);
  });

  app.use(addRuntime);

  app.use((req, res, next) => {
    if (res.page) {
      return res.send(res.page.toString());
    }
    next();
  });

  /* eslint-disable-next-line no-unused-vars */
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500);
    res.send("Something broke!");
  });

  app.listen(3000, () => {
    console.info("Server listening on port 3000!");
  });
}
exports.dev = dev;
