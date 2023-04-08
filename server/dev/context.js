function context(req, res, next) {
  res.__islands = {};
  res.__ce = {};
  res.__promises = [];
  next();
}

exports.context = context;
