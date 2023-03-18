#!/usr/bin/env node
const { rm } = require("node:fs/promises");
const { join } = require("node:path");

const { dev } = require("../server/dev");

const { generateConfig } = require("./argv");
const { initializeServerElements } = require("../server/se/initialize");

async function main() {
  const config = await generateConfig();

  console.log(
    `Development mode from ${config.from} at ${config.host}:${config.port}`
  );

  await rm(join(config.from, ".dev"), {
    recursive: true,
    force: true,
  }).catch(() => {});

  await initializeServerElements();

  return dev();
}

module.exports = main();
