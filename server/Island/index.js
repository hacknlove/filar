const vm = require("vm");
const { fullIslandState } = require("../common/fullIslandState");

function tryExpresionInContext(expression, context, isLive) {
  try {
    return [vm.runInNewContext(expression, context), isLive];
  } catch {
    //
  }
}

function elementAttributesToObject(element) {
  const attributes = {};

  for (const attribute of element.attributes) {
    attributes[attribute.name] = attribute.value;
  }

  return attributes;
}

async function makeAnIsland(element, attributes, context) {
  const currentIslandId =
    element.getAttribute("id") || `i-${context.Indexes.lastIslandId++}`;

  const state = {};
  const live = {};

  const vmClientContext = fullIslandState(element, context);
  const vmServerContext = Object.assign({}, vmClientContext);

  for (const k in context) {
    vmServerContext[k] = context[k];
  }

  for (const attribute in attributes) {
    const expression = attributes[attribute];
    const [value, isLive] = tryExpresionInContext(
      expression,
      vmClientContext,
      true
    ) ||
      tryExpresionInContext(expression, vmServerContext, false) || [
        expression,
        false,
      ];

    state[attribute] = value;
    if (isLive) {
      live[attribute] = expression;
    }
  }

  if (!element.getAttribute("id")) {
    element.setAttribute("id", currentIslandId);
  }
  context.__islands[currentIslandId] = {
    state,
    live,
    expressions: {},
    offsets: {},
  };
}

exports.makeAnIsland = makeAnIsland;
exports.elementAttributesToObject = elementAttributesToObject;
