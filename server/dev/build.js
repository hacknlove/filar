const { matchOne } = require("./matchRoute");

const { prebuild } = require("./prebuild");

async function build(req, res, next) {
  console.log(`Building ${req.url}...`);

  const { filePath, params } = await matchOne(req.url);

  if (!filePath) {
    return next();
  }

  req.filePath = filePath;
  // req.params cannot be used because express will overwrite it with its own route params
  req.devparams = params.params;
  res.__islands = {};
  res.page = await prebuild(filePath, res.__islands);

  next();
}

exports.build = build;
