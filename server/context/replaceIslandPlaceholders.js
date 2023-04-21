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
function fullState(node, context) {
  let state = {};
  while (node) {
    if (context.__islands[node.id]) {
      state = Object.assign({}, context.__islands[node.id].state, state);
    }
    node = node.parentNode;
  }
  return state;
}

function replaceIslandPlaceholders({
  node,
  text,
  island: { expressions, offsets },
  attribute,
  context,
}) {
  const contextRegexp = /{\((.+?)\)}/g;

  let offset = 0;
  let replaceIndex = 0;

  const target = attribute.startsWith("t-") ? node.parentNode : node;

  const newText = text.replace(contextRegexp, (match, expresion, index) => {
    if (!target.id) {
      target.id = `n-${context.Indexes.currentNodeId++}`;
    }

    let replacement = expressions[expresion]?.value;

    if (expressions[expresion] === undefined) {
      const vmState = fullState(node, context);
      try {
        replacement = vm.runInNewContext(expresion, vmState).toString();
        expressions[expresion] = {
          value: replacement,
          replacements: [],
        };
      } catch (error) {
        replacement = expresion;
        expressions[expresion] = {
          value: replacement,
          replacements: [],
        };
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
