const argv = require("minimist")(process.argv.slice(2));

console.log(`Building from ${argv.from} to ${argv.to}...`);

console.log({ argv });

const { buildAll } = require("./buildAll");

const { initializeCustomElements } = require("../SSCE/initialize");

if (argv.watch) {
  console.log("Watch mode enabled...");
  /*   require("../SSCE/watch").watchCustomElements({
    from: argv.from,
    buildAll
  });
 */
}

async function main() {
  await initializeCustomElements({
    from: argv.from,
  });
  buildAll({
    from: argv.from,
    to: argv.to,
  });
}

main();
