const config = require("../config");
const { isAModule } = require("./isAModule");
const { dirname } = require("path");

async function getStaticContext(filePath) {
  const importPath = filePath.substring(0, filePath.length - 5); //.html length is 5
  const dir = dirname(filePath);
  const context = Object.create({
    filePath,
    dir,
    Indexes: {
      lastIslandId: 0,
      currentNodeId: 0,
    },
    __islands: {},
    __ce: {},
    __promises: [],
  });
  if (isAModule(importPath)) {
    if (config.dev) {
      delete require.cache[require.resolve(importPath)];
    }
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

  if (config.context) {
    Object.assign(
      context,
      typeof config.context === "function"
        ? config.context({
            filePath,
            dir,
            config,
          })
        : config.context
    );
  }

  return context;
}

exports.getStaticContext = getStaticContext;
