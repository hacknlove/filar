function findIsland(node, context) {
  while (node) {
    if (context.__islands[node.id]) {
      return context.__islands[node.id];
    }
    node = node.parentNode;
  }
  return null;
}

exports.findIsland = findIsland;
