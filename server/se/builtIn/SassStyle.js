const config = require("../../config");
const { resolveSrc } = require("../../common/resolveSrc");
const { globAsync } = require("../../common/globAsync");
const { readFile, writeFile } = require("fs-extra");
const sass = require("sass");
const parser = new (require("linkedom").DOMParser)();
const { getRoot } = require("../../tree/getRoot");

async function processCustomElement(element, context) {
  const cwd = resolveSrc({
    src: element.getAttribute("cwd"),
    root: config.from,
    relative: context.dir,
  });

  const pattern = element.getAttribute("pattern") || "**/*.{scss,css}";

  const files = await globAsync(pattern, {
    cwd,
    absolute: true,
    ignore: ["*.se.{scss,css}", "**/*.ce.{scss,css}"],
  });

  let scss = "";
  const vars = new Map();

  for (const file of files) {
    const content = await readFile(file, "utf-8");

    scss += content;

    const matches = content.matchAll(/var\(--(?<var>[^,)]+)/g);

    for (const match of matches) {
      const cssvar = match.groups.var;
      const value = element.getAttribute(cssvar);
      if (cssvar && !vars.has(cssvar) && value) {
        vars[cssvar] = vars.set(cssvar, value);
      }
    }
  }

  if (vars.size) {
    scss = `:root{${Array.from(
      vars.entries(),
      ([key, value]) => `--${key}: ${value};`
    ).join("")}}\n${scss}`;
  }

  const { css } = sass.compileString(scss, { style: "compressed" });

  const head = getRoot(element).querySelector("head");
  element.remove();

  if (element.getAttribute("inline") === "") {
    head.appendChild(
      parser.parseFromString(`<style>${css}</style>`).firstElementChild
    );
    return;
  }

  const sha256 = require("crypto")
    .createHash("sha256")
    .update(css)
    .digest("hex", "hex");

  head.appendChild(
    parser.parseFromString(
      `<link rel="stylesheet" href="${sha256}.css" type="text/css" />`
    ).firstElementChild
  );

  await writeFile(`${config.from}/.build/static/${sha256}.css`, css);
}

exports.processCustomElement = processCustomElement;
