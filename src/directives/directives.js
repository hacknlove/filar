const glob = require('glob');

const directives = {}

const directiveNameRegExp = /(?<directiveName>[^/]+).directive.js$/;

glob(`${__dirname}/**/*.directive.js`, (err, files) => {
    for (const file of files) {
        const directiveName = file.match(directiveNameRegExp).groups.directiveName;
        directives[directiveName] = require(file)[directiveName];
    }
})

exports.directives = directives;