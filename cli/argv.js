const { resolve } = require("path");
const config = require("../server/config");
const { existsSync } = require("fs");

async function generateConfig(fromCli) {
  // Set defaults
  Object.assign(config, fromCli, {
    from: process.env.FROM || "",
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
    ...JSON.parse(process.env.CONFIG || "{}"),
  });

  // Override with command line arguments
  const argv = require("minimist")(process.argv.slice(3));
  Object.assign(config, argv);

  // Resolve from
  config.from = resolve(process.cwd(), config.from);

  // Override with filar.config.js
  if (existsSync(resolve(config.from, "filar.config.js"))) {
    await require(resolve(config.from, "filar.config.js"))(config);
  }

  // Attach middleware and router
  if (typeof config.middleware === "string") {
    config.middleware = require(resolve(config.from, config.middleware));
  } else if (existsSync(resolve(config.from, "middleware.js"))) {
    config.middleware = require(resolve(config.from, "middleware.js"));
  }

  if (typeof config.router === "string") {
    config.router = require(resolve(config.from, config.router));
  } else if (existsSync(resolve(config.from, "router.js"))) {
    config.router = require(resolve(config.from, "router.js"));
  }

  return config;
}

exports.generateConfig = generateConfig;
