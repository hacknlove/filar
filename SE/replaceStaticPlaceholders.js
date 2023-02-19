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
      console.error(error);
      throw new Error("Error while evaluating static expression", {
        reason: {
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
