const argv = require("minimist")(process.argv.slice(2));

const config = require("../server/config");

module.exports = Object.assign(config, argv);