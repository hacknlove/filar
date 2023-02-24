const { readFile } = require("fs-extra");
const { DOMParser } = require("linkedom");
const { processDirectives } = require("./directives/processDirectives");
const { processCustomComponents } = require("./customComponents/processAll");

const parser = new DOMParser();

async function processPage(req, res, filePath) {
  const file = await readFile(filePath, "utf8").catch((error) => {
    if (error.code === "ENOENT") {
      if (!req.rewriteTo404) {
        req.rewriteTo404 = true;
        return { error: processPage(req, res, "404.html") };
      }
    }
    if (req.rewriteTo500) {
      res.status("500");
      console.warn("Error while processing 500.html");
      return { error: "Internal Server Error" };
    }
    req.rewriteTo500 = true;
    return { error: processPage(req, res, "500.html") };
  });

  if (file.error) {
    return file.error;
  }

  const document = parser.parseFromString(file).firstChild;

  processDirectives(req, res, document);

  await processCustomComponents(document);

  return document.toString();
}

exports.processPage = processPage;
