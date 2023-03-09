const { join, resolve } = require("path");

function resolveSrc({ src, relative, root }) {
  if (!relative.startsWith(root)) {
    relative = join(root, relative);
  }

  if (src === null) {
    return root;
  }
  if (src === "") {
    return relative;
  }

  let resolved;

  if (src.startsWith("/")) {
    resolved = resolve(root, src.substring(1));
  } else {
    resolved = resolve(relative, src);
  }

  if (resolved.startsWith(root)) {
    return resolved;
  }

  throw new Error(`Not allowed to resolve path outside of ${root}`);
}

exports.resolveSrc = resolveSrc;
