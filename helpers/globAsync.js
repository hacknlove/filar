const { promisify } = require("util");
const globAsync = promisify(require("glob"));

exports.globAsync = globAsync;