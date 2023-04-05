const httpRegex = /^(https?:)?\/\//;
const vm = require("vm");
const { resolveSrc } = require("../../common/resolveSrc");

async function fromAPI(src, context) {
  Object.assign(context, await fetch(src).then((response) => response.json()));
}

const config = require("../../config");
const { isAModule } = require("../../common/isAModule");

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
    vm.runInNewContext(innerText, { context });
    return;
  } catch {
    // Not JS
  }

  throw new Error("Context innerText must be JSON or JS", {
    innerText,
  });
}

async function fromFile(src, context) {
  const expandedSrc = resolveSrc({
    src,
    root: config.from,
    relative: context.dir,
  });

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

async function processServerElement(element, context) {
  if (element.getAttribute("ssr") && !element.getAttribute("build")) {
    return;
  }
  const src = element.getAttribute("src");

  const parentContext = context.__proto__;

  if (httpRegex.test(src)) {
    await fromAPI(src, parentContext);
  } else if (src) {
    await fromFile(src, parentContext);
  }

  if (element.innerText.trim()) {
    frominnerText(element, parentContext);
  }

  if (!element.getAttribute("ssr")) {
    element.remove();
  }
}

exports.processServerElement = processServerElement;

exports.__test__ = {
  fromFile,
};
