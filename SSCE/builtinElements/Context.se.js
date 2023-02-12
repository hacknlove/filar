const { join, resolve } = require("path");
const httpRegex = /^(https?:)?\/\//;

async function fromAPI(src, context) {
  Object.assign(context, await fetch(src).then((response) => response.json()));
}

function isAModule(src) {
  try {
    require.resolve(src);
    return true;
  } catch (error) {
    return false;
  }
}

async function fromFile(src, context) {
  let expandedSrc = src;
  if (src[0] === "/") {
    expandedSrc = join(process.cwd(), context.from, src);
  } else if (src[0] === ".") {
    expandedSrc = resolve(
      join(process.cwd(), context.from, context.filePath),
      src
    );
  }

  if (!isAModule(src)) {
    console.warn(`${expandedSrc} cannot be found`, { src, context });
  }
  const required = require(join(process.cwd(), context.from, src));

  if (typeof required.assign === "function") {
    Object.assign(context, await required.assign(context));
    return;
  }

  if (typeof required.transform === "function") {
    await required.transform(context);
    return;
  }

  Object.assign(context, required);
}

async function processCustomElement(element, context) {
  if (element.getAttribute("ssr" && !element.getAttribute("build"))) {
    return;
  }
  const src = element.getAttribute("src");

  if (httpRegex.test(src)) {
    fromAPI(src, context);
  } else if (src) {
    fromFile(src, context);
  }

  if (!element.getAttribute("ssr")) {
    element.remove();
  }
}

exports.processCustomElement = processCustomElement;
