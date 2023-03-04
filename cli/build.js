#!/usr/bin/env node
const { from } = require('./argv');

console.log(`Building from ${from}`);

const { buildAll } = require("../server/build/all");

const { initializeServerElements } = require("../server/se/initialize");

async function main() {
  await initializeServerElements();

  return buildAll();
}

main();
