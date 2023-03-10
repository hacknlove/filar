const vm = require("node:vm");

function replaceIslandPlaceholders({ text, island, childNumber }) {
  const contextRegexp = /{\((.+?)\)}/g;

  const serialized = [];

  let offset = 0;

  const newText = text.replace(contextRegexp, (match, expresion, index) => {
    let replacement;
    try {
      replacement = vm.runInNewContext(expresion, island);
    } catch (error) {
      throw new Error("Error while evaluating island", {
        cause: {
          text,
          expresion,
          island,
        },
      });
    }

    serialized.push([
      childNumber,
      index + offset,
      replacement.length,
      expresion,
    ]);

    offset += replacement.length - match.length;
    return replacement;
  });

  if (!serialized.length) {
    return {};
  }

  return {
    text: newText,
    serialized,
  };
}

exports.replaceIslandPlaceholders = replaceIslandPlaceholders;
