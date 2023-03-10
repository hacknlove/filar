const vm = require("node:vm");

function replaceStaticPlaceholders({ text, context, island = {} }) {
  const contextRegexp = /{{(.+?)}}/g;

  return text.replace(contextRegexp, (_match, expresion) => {
    try {
      return vm.runInNewContext(expresion, {
        ...context,
        ...island,
      });
    } catch (error) {
      delete context.parentContext;
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
