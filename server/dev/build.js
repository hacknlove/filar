const { matchOne } = require("./matchRoute");

const { prebuild } = require("./prebuild");

async function build (req, res, next) {
  console.log(`Building ${req.url}...`);

  const { filePath, params } = await matchOne(req.url);

  if (!filePath) {
    return next();
  }

  req.filePath = filePath;
  req.params = params;
  res.page = await prebuild(filePath);

  next()
}


exports.build = build;