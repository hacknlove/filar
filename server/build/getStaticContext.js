const config = require("../config");
const { isAModule } = require("../common/isAModule");
const { dirname } = require("path");

async function getStaticContext(filePath) {
  const importPath = filePath.substring(0, filePath.length - 5); //.html length is 5
  const dir = dirname(filePath);
  const context = {
    filePath,
    dir,
  };
  if (isAModule(importPath)) {
    const requiredContext = require(importPath);
    if (typeof requiredContext === "function") {
      Object.assign(
        context,
        requiredContext({
          filePath,
          dir,
          config,
        })
      );
    } else {
      Object.assign(context, requiredContext);
    }
  }

  if (typeof config.context === "function") {
    Object.assign(
      context,
      config.context({
        filePath,
        dir,
        config,
      })
    );
  } else if (typeof config.context === "object") {
    Object.assign(context, config.context);
  }

  return context;
}

exports.getStaticContext = getStaticContext;
