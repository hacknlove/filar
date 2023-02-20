const argv = require("minimist")(process.argv.slice(2));

console.log(`Building from ${argv.from} to ${argv.to}...`);

const { buildAll } = require("./buildAll");

const { initializeServerElements } = require("../SE/initializeServerElements");

if (argv.watch) {
  console.log("Watch mode enabled...");
  require("../SE/watch").watchServerElements({
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
