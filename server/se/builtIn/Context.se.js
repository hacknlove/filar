const { join, resolve, dirname } = require("path");
const httpRegex = /^(https?:)?\/\//;
const vm = require("vm");
async function fromAPI(src, context) {
  Object.assign(context, await fetch(src).then((response) => response.json()));
}

const { from } = require("../../config");

function isAModule(src) {
  try {
    require.resolve(src);
    return true;
  } catch (error) {
    return false;
  }
}

function frominnerText(element, context) {
  const innerText = element.innerText;

  try {
    const json = JSON.parse(innerText);
    Object.assign(context, json);
    return;
  } catch {
    // Not JSON
  }

  try {
    vm.runInNewContext(innerText, { context: context });
    return;
  } catch {
    // Not JS
  }

  throw new Error("Context innerText must be JSON or JS", {
    innerText,
  });
}

async function fromFile(src, context) {
  let expandedSrc = src;
  if (src[0] === "/") {
    expandedSrc = join(process.cwd(), from, src);
  } else if (src[0] === ".") {
    expandedSrc = resolve(
      dirname(join(process.cwd(), from, context.filePath)),
      src
    );
  }

  if (!isAModule(expandedSrc)) {
    throw new Error(`${expandedSrc} cannot be found`, {
      cause: { src, context },
    });
  }
  let required;
  try {
    required = require(expandedSrc);
  } catch (error) {
    throw new Error(`${expandedSrc} cannot be parsed`, {
      cause: {
        src,
        context,
        error,
      },
    });
  }

  if (typeof required.transform === "function") {
    try {
      await required.transform(context);
    } catch (error) {
      throw new Error(`${expandedSrc} cannot be transformed`, {
        src,
        context,
        error,
      });
    }
  }

  Object.assign(context, required);
}

async function processCustomElement(element, context) {
  if (element.getAttribute("ssr") && !element.getAttribute("build")) {
    return;
  }
  const src = element.getAttribute("src");

  if (httpRegex.test(src)) {
    await fromAPI(src, context.parentContext);
  } else if (src) {
    await fromFile(src, context.parentContext);
  }

  if (element.innerText.trim()) {
    frominnerText(element, context.parentContext);
  }

  if (!element.getAttribute("ssr")) {
    element.remove();
  }
}

exports.processCustomElement = processCustomElement;

exports.__test__ = {
  fromFile,
};
