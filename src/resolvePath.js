const { join } = require('path');

function resolvePath (path) {
  if (path.endsWith('/')) {
    path += 'index.html'
  }
  if (!path.endsWith('.html')) {
    path += '.html';
  }
  path = join(process.cwd(), path)

  return path;
}

exports.resolvePath = resolvePath;