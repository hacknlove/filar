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

exports.fullState = fullState;
