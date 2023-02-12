const vm = require("node:vm");

function replacePlaceholders(text, context) {
  const contextRegexp = new RegExp(
    `{{(${Object.keys(context).join("|")})}}`,
    "g"
  );

  const replaced = text.replace(contextRegexp, (_match, p1) => context[p1]);

  const jsRegexp = /{\|(.+?)\|}/g;

  return replaced.replace(jsRegexp, (_match, p1) =>
    vm.runInNewContext(p1, context)
  );
}

exports.replacePlaceholders = replacePlaceholders;
