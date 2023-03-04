const { resolve } = require('path');
const config = require("../server/config");
const argv = require("minimist")(process.argv.slice(2));

if (argv.from) {
    argv.from = resolve(process.cwd(), argv.from)
}

module.exports = Object.assign(config, argv);
