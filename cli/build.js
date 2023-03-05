#!/usr/bin/env node
const { rmdir } = require("node:fs/promises");
const { join } = require("node:path");

const { generateConfig } = require("./argv");
const { buildAll } = require("../server/build/all");
const { initializeServerElements } = require("../server/se/initialize");

async function main() {
  const config = await generateConfig();

  console.log(`Building from ${config.from}`);

  await rmdir(join(config.from, ".build"), { recursive: true, force: true });
  await initializeServerElements();

  return buildAll();
}

module.exports = main();
