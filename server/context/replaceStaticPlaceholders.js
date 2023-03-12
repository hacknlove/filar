const vm = require("node:vm");

function replaceStaticPlaceholders({ text, context, island = {} }) {
  const contextRegexp = /{{(.+?)}}/g;

  return text.replace(contextRegexp, (_match, expresion) => {
    const vmContext = Object.create(context);
    Object.assign(vmContext, island);
    try {
      return vm.runInNewContext(expresion, vmContext);
    } catch (error) {
      throw new Error("Error while evaluating static expression", {
        cause: {
          message: error.message,
          text,
          expresion,
          context,
          island,
        },
      });
    }
  });
}

exports.replaceStaticPlaceholders = replaceStaticPlaceholders;
