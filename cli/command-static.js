#!/usr/bin/env node
const { rmdir } = require("node:fs/promises");
const { join } = require("node:path");

const { generateConfig } = require("./argv");
const { static } = require("../server/static");
const { initializeServerElements } = require("../server/se/initialize");

async function main() {
  const config = await generateConfig({
    static: true,
    staticDir: ".static",
  });

  console.info(`Building static site from ${config.from}`);

  await rmdir(join(config.from, ".static"), {
    recursive: true,
    force: true,
  }).catch(() => {});

  await initializeServerElements();

  return static();
}

module.exports = main();
