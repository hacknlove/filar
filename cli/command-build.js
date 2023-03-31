#!/usr/bin/env node
const { rmdir } = require("node:fs/promises");
const { join } = require("node:path");

const { generateConfig } = require("./argv");
const { build } = require("../server/build");
const { initializeServerElements } = require("../server/se/initialize");

async function main() {
  const config = await generateConfig({
    build: true,
    staticDir: ".build/static",
  });

  console.log(`Building from ${config.from}`);

  await rmdir(join(config.from, ".build"), {
    recursive: true,
    force: true,
  }).catch(() => {});

  await initializeServerElements();

  return build();
}

module.exports = main();
