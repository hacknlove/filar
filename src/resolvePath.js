const { join } = require('path');

function resolvePath (path) {
  if (path.endsWith('/')) {
    path += 'index.route.html'
  }
  if (!path.endsWith('.route.html')) {
    path += '.route.html';
  }
  path = join(process.cwd(), path)

  return path;
}

exports.resolvePath = resolvePath;