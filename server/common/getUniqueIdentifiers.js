const esprima = require("esprima");

/**
 * Recursively gets the full member expression string from a given AST node.
 * @param {Object} node - The AST node to get the member expression from.
 * @returns {string} - The full member expression string.
 */
function getFullMemberExpression(node) {
  if (node.type === "MemberExpression") {
    const objectName = getFullMemberExpression(node.object);
    const propertyName = node.property.name;
    return `${objectName}.${propertyName}`;
  } else {
    return node.name;
  }
}

/**
 * Recursively extracts identifiers from the given AST node.
 * @param {Object} node - The AST node to extract identifiers from.
 * @param {Set} [identifiers=new Set()] - The set of unique identifiers found in the expression.
 * @param {Object|null} [parentNode=null] - The parent node of the current node.
 * @returns {Set} - The set of unique identifiers found in the expression.
 */
function extractIdentifiersFromAST(
  node,
  identifiers = new Set(),
  parentNode = null
) {
  if (node.type === "MemberExpression") {
    const fullExpression = getFullMemberExpression(node);
    identifiers.add(fullExpression);
  } else if (node.type === "Identifier") {
    if (!parentNode || parentNode.type !== "VariableDeclarator") {
      identifiers.add(node.name);
    }
  } else {
    for (const key in node) {
      const child = node[key];
      if (typeof child === "object" && child !== null) {
        if (Array.isArray(child)) {
          child.forEach((c) => extractIdentifiersFromAST(c, identifiers, node));
        } else {
          extractIdentifiersFromAST(child, identifiers, node);
        }
      }
    }
  }

  return identifiers;
}

/**
 * Extracts unique identifiers from a given JavaScript expression.
 * @param {string} jsExpression - The JavaScript expression to extract identifiers from.
 * @returns {string[]} - An array of unique identifiers found in the expression.
 */
function getUniqueIdentifiers(jsExpression) {
  const ast = esprima.parseScript(jsExpression);
  const identifiers = extractIdentifiersFromAST(ast);
  return Array.from(identifiers);
}

exports.getUniqueIdentifiers = getUniqueIdentifiers;

// Driver: GTP-4
// Navigator: Me
