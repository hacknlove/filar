const glob = require("glob");

const directives = {};

const directiveNameRegExp = /(?<directiveName>[^/]+).directive.js$/;

async function initializeDirectives() {
  return new Promise((resolve) => {
    glob(`${__dirname}/**/*.directive.js`, (err, files) => {
      for (const file of files) {
        const directiveName =
          file.match(directiveNameRegExp).groups.directiveName;
        directives[directiveName] = require(file)[directiveName];
      }
      resolve();
    });
  });
}

exports.directives = directives;
exports.initializeDirectives = initializeDirectives;
