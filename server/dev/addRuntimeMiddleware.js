const { addRuntime } = require("../common/addRuntime");

async function addRuntimeMiddleware(req, res, next) {
  if (!res.page) {
    return next();
  }
  if (!Object.getOwnPropertyNames(res.__islands).length) {
    return next();
  }

  await addRuntime(res.page, res.__islands);
  next();
}

exports.addRuntimeMiddleware = addRuntimeMiddleware;
