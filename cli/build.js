#!/usr/bin/env node
const { rmdir } = require('node:fs/promises');
const { join } = require('node:path');

const { from } = require('./argv');

console.log(`Building from ${from}`);

const { buildAll } = require("../server/build/all");

const { initializeServerElements } = require("../server/se/initialize");

async function main() {
  await rmdir(join(from, '.build'), { recursive: true, force: true });
  await initializeServerElements();

  return buildAll();
}

module.exports = main();
