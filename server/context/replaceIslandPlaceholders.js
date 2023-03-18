const vm = require("node:vm");

let currentNodeId = 0;

function replaceIslandPlaceholders({
  node,
  text,
  island: { state, expressions, offsets },
  attribute,
}) {
  const contextRegexp = /{\((.+?)\)}/g;

  let offset = 0;
  let replaceIndex = 0;

  const newText = text.replace(contextRegexp, (match, expresion, index) => {
    if (!node.parentNode.id) {
      node.parentNode.id = `n-${currentNodeId++}`;
    }

    let replacement = expressions[expresion]?.value;

    if (expressions[expresion] === undefined) {
      try {
        replacement = vm.runInNewContext(expresion, state).toString();
        expressions[expresion] = {
          value: replacement,
          replacements: [],
        };
      } catch (error) {
        throw new Error("Error while evaluating island", {
          cause: {
            text,
            expresion,
            state,
          },
        });
      }
    }

    offsets[node.parentNode.id] ??= {};
    offsets[node.parentNode.id][attribute] ??= [];
    offsets[node.parentNode.id][attribute].push(index + offset);

    expressions[expresion].replacements.unshift([
      node.parentNode.id,
      attribute,
      replaceIndex++,
    ]);

    offset += replacement.length - match.length;
    return replacement;
  });

  node.textContent = newText;
}

exports.replaceIslandPlaceholders = replaceIslandPlaceholders;
