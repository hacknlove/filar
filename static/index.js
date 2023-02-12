const argv = require("minimist")(process.argv.slice(2));

console.log(`Building from ${argv.from} to ${argv.to}...`);

const { buildAll } = require("./buildAll");

const { initializeCustomElements } = require("../SSCE/initialize");
const {
  initializeBuiltInElements,
} = require("../SSCE/initializeBuiltInElements");

if (argv.watch) {
  console.log("Watch mode enabled...");
  require("../SSCE/watch").watchCustomElements({
    from: argv.from,
    buildAll,
  });
}

async function main() {
  await Promise.all([
    initializeBuiltInElements(),
    initializeCustomElements({
      from: argv.from,
    }),
  ]);

  return buildAll({
    from: argv.from,
    to: argv.to,
  });
}

main();
