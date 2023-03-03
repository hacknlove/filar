const argv = require("minimist")(process.argv.slice(2));

console.log(`Building from ${argv.from}`);

const { buildAll } = require("../server/build/all");

const { initializeServerElements } = require("../server/se/initialize");

if (argv.watch) {
  console.log("Watch mode enabled...");
  require("../server/se/watch").watchServerElements(buildAll);
}

async function main() {
  await initializeServerElements();

  return buildAll();
}

main();
