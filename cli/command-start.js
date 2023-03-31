#!/usr/bin/env node
const { generateConfig } = require("./argv");

const { serve } = require("../server/ssr");

const { initializeServerElements } = require("../server/se/initialize");

async function main() {
  const config = await generateConfig();
  const { from, host, port } = config;

  console.log(`Serving from ${from} at ${host}:${port}`);

  await initializeServerElements();

  return serve();
}

main();
