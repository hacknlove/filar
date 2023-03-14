const config = require("../config");

function context(req, res, next) {
  req.filar = {
    config: Object.create(config),
    context: {},
  };
  next();
}

exports.context = context;
