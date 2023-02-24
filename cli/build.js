const argv = require("minimist")(process.argv.slice(2));

console.log(`Building from ${argv.from} to ${argv.to}...`);

const { buildAll } = require("../server/build/all");

const { initializeServerElements } = require("../server/se/initialize");

if (argv.watch) {
  console.log("Watch mode enabled...");
  require("../server/se/watch").watchServerElements({
    from: argv.from,
    buildAll,
  });
}

async function main() {
  await initializeServerElements({
    from: argv.from,
  });

  return buildAll({
    from: argv.from,
    to: argv.to,
  });
}

main();
