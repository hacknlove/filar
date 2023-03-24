const vm = require("node:vm");

function getTextChildNumber(node) {
  let i = 0;
  for (; (node = node.previousSibling); node.nodeType === 3 && i++);
  return i;
}

function findIsland(node, context) {
  while (node) {
    if (context.__islands[node.id]) {
      return context.__islands[node.id];
    }
    node = node.parentNode;
  }
  return null;
}

function replaceIslandPlaceholders({
  node,
  text,
  island: { state, expressions, offsets },
  attribute,
  context
}) {
  const contextRegexp = /{\((.+?)\)}/g;

  let offset = 0;
  let replaceIndex = 0;

  const target = attribute.startsWith("t-") ? node.parentNode : node;

  const newText = text.replace(contextRegexp, (match, expresion, index) => {
    if (!target.id) {
      target.id = `n-${context.currentNodeId++}`;
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

    offsets[target.id] ??= {};
    offsets[target.id][attribute] ??= [];
    offsets[target.id][attribute].push(index + offset);

    expressions[expresion].replacements.unshift([
      target.id,
      attribute,
      replaceIndex++,
    ]);

    offset += replacement.length - match.length;
    return replacement;
  });

  if (attribute.startsWith("t-")) {
    node.textContent = newText;
  } else {
    target.setAttribute(attribute, newText);
  }
}

exports.replaceIslandPlaceholders = replaceIslandPlaceholders;
exports.getTextChildNumber = getTextChildNumber;
exports.findIsland = findIsland;
