#!/usr/bin/env node
const { rm } = require("node:fs/promises");
const { join } = require("node:path");

const { dev } = require("../server/dev");

const { generateConfig } = require("./argv");
const { initializeServerElements } = require("../server/se/initialize");
const { initializeClientElements } = require("../server/ce/initialize");

async function main() {
  const config = await generateConfig({
    dev: true,
    staticDir: ".dev",
  });

  console.info(
    `Development mode from ${config.from} at http://${config.host}:${config.port}`
  );

  await rm(join(config.from, ".dev"), {
    recursive: true,
    force: true,
  }).catch(() => {});

  await Promise.all([initializeServerElements(), initializeClientElements()]);

  return dev();
}

module.exports = main();
